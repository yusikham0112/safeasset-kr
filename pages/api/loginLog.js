import { connectDB } from "@/util/db";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getToken({ req });
  const session2 = await getSession({ req });

  let ip;

  const db = (await connectDB).db("fxtest");
  if (req.headers["x-forwarded-for"]) {
    ip = req.headers["x-forwarded-for"].split(",")[0];
  } else {
    ip = req.connection.remoteAddress;
  }

  return res.status(200).json({ ip: ip, session: session, session2: session2 });

  const user = await db
    .collection("user_cred")
    .updateOne({ id: session.user.id }, { $set: { last_ip: ip } });
}
