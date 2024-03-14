"use server";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/db";
import { getServerSession } from "next-auth";

export async function postLog(ip) {
  const session = await getServerSession(authOptions);
  const db = (await connectDB).db("fxtest");
  db.collection("user_cred").updateOne(
    { id: session.user.id },
    { $set: { last_ip: ip } }
  );
  return true;
}
