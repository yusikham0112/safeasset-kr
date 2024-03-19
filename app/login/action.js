"use server";
process.env.TZ = "Asia/Seoul";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/db";
import { getServerSession } from "next-auth";

export async function postLog(ip) {
  const session = await getServerSession(authOptions);
  const db = (await connectDB).db("fxtest");
  let user = await db.collection("user_cred").findOne({ id: session.user.id });
  let data;
  if (user.ip) {
    data = [{ date: getDate(false, 0), ip: ip }, ...user.ip];
  } else {
    data = [{ date: getDate(false, 0), ip: ip }];
  }
  db.collection("user_cred").updateOne(
    { id: session.user.id },
    { $set: { ip: data } }
  );
  return true;
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
