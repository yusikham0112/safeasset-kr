"use server";
process.env.TZ = "Asia/Seoul";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

export async function getNotice() {
  const session = await getServerSession(authOptions);
  const db = (await connectDB).db("fxtest");
  const user = await db
    .collection("user_cred")
    .findOne({ id: session.user.id });
  const list = await db
    .collection("message")
    .find({ user: user._id })
    .sort({ _id: -1 })
    .toArray();
  list.map((e) => {
    e._id = e._id.toString();
    e.user = e.user.toString();
  });
  return list;
}
