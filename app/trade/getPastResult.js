"use server";
process.env.TZ = "Asia/Seoul";

import axios from "axios";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/db";
import { getServerSession } from "next-auth";

require("dotenv").config();

export async function getPastResult(symbol, interval) {
  const session = await getServerSession(authOptions);
  let db = (await connectDB).db("fxtest");
  const user = await db
    .collection("user_cred")
    .findOne({ id: session.user.id });
  const remotes = await db
    .collection("remote")
    .find({ target: user._id })
    .toArray();

  let results = [{ price: 0 }];
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol: symbol,
        interval: interval == "2m" ? "1m" : interval,
        limit: 120,
      },
    });
    response.data.map((e, i, r) => {
      const date = getDate(e[0]);
      if (date % 2 != 0 && interval == "2m") {
        return null;
      }
      remotes.map((remote) => {
        if (
          remote.date == date &&
          remote.symbol == symbol &&
          remote.interval == interval
        ) {
          e[4] = remote.price;
        }
      });
      if (i != r.length - 1 && response.data[i - 90 / +interval.slice(0, 1)]) {
        results = [
          {
            date: date,
            round:
              "(" +
              (
                (+date.toString().slice(8, 10) * 60 +
                  +date.toString().slice(10)) /
                Number(interval.replace(/\D/g, ""))
              ).toString() +
              "회차)",
            price: response.data[i - 90 / +interval.slice(0, 1)][4],
            result:
              response.data[i - 90 / +interval.slice(0, 1)][4] -
                results[0].price >
              0
                ? "Long"
                : "Short",
          },
          ...results,
        ];
      }
    });
    return results;
  } catch (e) {
    console.log(e);
    return ["error"];
  }
}

function getDate(i) {
  let date;
  i ? (date = new Date(i)) : (date = new Date());
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
