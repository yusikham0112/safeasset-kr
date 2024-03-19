"use server";
process.env.TZ = "Asia/Seoul";
import { connectDB } from "@/util/db";

export async function getNotice() {
  const db = (await connectDB).db("fxtest");
  const list = await db.collection("notice").find().sort({ _id: -1 }).toArray();
  list.map((e) => {
    e._id = e._id.toString();
  });
  return list;
}
