"use server";

import { connectDB } from "@/util/db";
import { ObjectId } from "mongodb";

export async function getUserInfo(userid) {
  const db = (await connectDB).db("fxtest");
  let user = await db
    .collection("user_cred")
    .findOne({ _id: new ObjectId(userid) });
  user._id = userid;
  return user;
}

export async function getRemoteData(id, symbol, interval, date) {
  const db = (await connectDB).db("fxtest");
  let remote = await db.collection("remote").findOne({
    target: new ObjectId(id),
    symbol: symbol,
    interval: interval,
    date: date,
  });
  if (remote) {
    remote._id = id;
    return remote.price;
  }

  return false;
}

export async function postRemoteData(id, symbol, interval, date, price) {
  const db = (await connectDB).db("fxtest");
  let remote = await db.collection("remote").insertOne({
    target: new ObjectId(id),
    symbol: symbol,
    interval: interval,
    date: date,
    price: price,
  });
}
