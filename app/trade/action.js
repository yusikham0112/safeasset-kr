"use server";
process.env.TZ = "Asia/Seoul";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/db";
import axios from "axios";
import { getServerSession } from "next-auth";

require("dotenv").config();

export async function Order(amount, type, symbol, interval) {
  const session = await getServerSession(authOptions);
  let result;
  let currentMin = new Date().getMinutes();
  let orderDate = getDate(
    false,
    +interval.slice(0, 1) - (currentMin % +interval.slice(0, 1))
  );

  let db = (await connectDB).db("fxtest");
  const user = await db
    .collection("user_cred")
    .findOne({ id: session.user.id });
  if (user.balance - amount < 0) {
    return "보유하고 있는 금액이 부족합니다.";
  }
  result = await db.collection("user_cred").updateOne(
    { _id: user._id },
    {
      $set: { balance: user.balance - amount },
    }
  );
  if (result == 0) {
    return "사용자 보유액 정보를 확인 할 수 없습니다.";
  }
  result = await db.collection("trade_order").insertOne({
    orderer: user._id,
    symbol: symbol,
    interval: interval,
    type: type,
    amount: amount,
    result: "pending",
    date: orderDate,
  });
  if (result.acknowledged === false) {
    return "거래 주문을 등록하지 못했습니다.";
  }
  orderCloser(orderDate, db, result.insertedId, user);
  return "주문이 등록되었습니다.";
}

async function orderCloser(orderDate, db, id, user) {
  while (true) {
    if (orderDate < getDate()) {
      await delay(1000);
      break;
    }
    await delay(100);
  }
  const order = await db.collection("trade_order").findOne({ _id: id });

  let response, currentPrice, pastPrice;
  try {
    response = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol: order.symbol,
        interval: order.interval == "2m" ? "1m" : order.interval,
        limit: 100,
      },
    });

    let temp = [];
    response.data.map((e) => {
      const date = getDate(e[0]);
      if (date % 2 != 0 && order.interval == "2m") {
        return null;
      }
      temp.push(e);
    });

    response.data = temp;

    const remotes = await db
      .collection("remote")
      .find({ target: user._id })
      .toArray();

    response.data.map((e, i) => {
      remotes.map((remote) => {
        if (
          remote.date == getDate(e[0], 0) &&
          remote.symbol == order.symbol &&
          remote.interval == order.interval
        ) {
          console.log("Run");
          e[4] = remote.price;
        }
      });
      if (getDate(e[0]) == order.date) {
        currentPrice = response.data[i - 90 / +order.interval.slice(0, 1)][4];
      }
      if (getDate(e[0]) == order.date - +order.interval.slice(0, 1)) {
        pastPrice = response.data[i - 90 / +order.interval.slice(0, 1)][4];
      }
    });

    const result = currentPrice - pastPrice > 0 ? "long" : "short";
    if (order.type == result) {
      await db
        .collection("trade_order")
        .updateOne({ _id: id }, { $set: { result: "gain" } });
      await db
        .collection("user_cred")
        .updateOne(
          { _id: order.orderer },
          { $inc: { balance: order.amount * process.env.NEXT_PUBLIC_RR_RATIO } }
        );
    } else {
      await db
        .collection("trade_order")
        .updateOne({ _id: id }, { $set: { result: "loss" } });
    }
  } catch (error) {
    console.log(`An error occurred: ${error}`);
  }
}

function getDate(i, p) {
  let date;
  i ? (date = new Date(i)) : (date = new Date());
  p ? date.setMinutes(date.getMinutes() + p) : "";
  const y = date.getFullYear().toString();
  let m = date.getMonth() + 1;
  m = m > 9 ? m.toString() : "0" + m.toString();
  let d = date.getDate();
  d = d > 9 ? d.toString() : "0" + d.toString();
  let h = date.getHours();
  h = h > 9 ? h.toString() : "0" + h.toString();
  let mm = date.getMinutes();
  mm = mm > 9 ? mm.toString() : "0" + mm.toString();
  return Number(y + m + d + h + mm);
}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
