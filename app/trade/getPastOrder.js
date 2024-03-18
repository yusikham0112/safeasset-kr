"use server";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/db";
import { getServerSession } from "next-auth";

export async function getPastOrder(symbol, interval) {
  const session = await getServerSession(authOptions);
  let db = (await connectDB).db("fxtest");
  const user = await db
    .collection("user_cred")
    .findOne({ id: session.user.id });
  const orders = await db
    .collection("trade_order")
    .find({ orderer: user._id, symbol: symbol, interval: interval })
    .toArray();

  let datas = [];
  orders.map((e) => {
    const data = {
      type: e.type,
      amount: e.amount,
      result:
        e.result == "gain"
          ? e.type
          : e.result == "loss"
          ? e.type == "long"
            ? "short"
            : "long"
          : "pending",
      date: e.date,
      round:
        "(" +
        (
          (+e.date.toString().slice(8, 10) * 60 +
            +e.date.toString().slice(10)) /
          Number(interval.replace(/\D/g, ""))
        ).toString() +
        "회차)",
    };
    datas = [data, ...datas];
  });
  return datas;
}
