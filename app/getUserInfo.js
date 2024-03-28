"use server";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/db";
import { getServerSession } from "next-auth";

export async function getUserInfo() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return false;
  }
  let db = (await connectDB).db("fxtest");
  const user = await db
    .collection("user_cred")
    .findOne({ id: session.user.id });
  return { name: user.name, balance: user.balance };
}
