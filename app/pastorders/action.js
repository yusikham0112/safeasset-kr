"use server";
process.env.TZ = "Asia/Seoul";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/db";
import { getServerSession } from "next-auth";

export async function getPastOrderList() {
  const session = await getServerSession(authOptions);
  const db = (await connectDB).db("fxtest");
  const user = await db
    .collection("user_cred")
    .findOne({ id: session.user.id });
  const list = await db
    .collection("trade_order")
    .find({
      orderer: user._id,
    })
    .sort({ _id: -1 })
    .toArray();
  list.map((e) => {
    e._id = e._id.toString();
    e.orderer = e.orderer.toString();
    e.round =
      "(" +
      (
        (+e.date.toString().slice(8, 10) * 60 + +e.date.toString().slice(10)) /
        Number(e.interval.replace(/\D/g, ""))
      ).toString() +
      "회차)";

    e.date = dateFormConvert(e.date);
  });
  return list;
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

function dateFormConvert(date) {
  if (date) {
    const data = date.toString();
    return (
      data.slice(0, 4) +
      "/" +
      data.slice(4, 6) +
      "/" +
      data.slice(6, 8) +
      " " +
      data.slice(8, 10) +
      ":" +
      data.slice(10, 12)
    );
  }
}
