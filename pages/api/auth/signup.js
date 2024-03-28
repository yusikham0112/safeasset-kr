import { connectDB } from "@/util/db";

export default async function handler(req, res) {
  if (req.method == "POST") {
    req.body.pw;
    req.body.balance = 0;
    req.body.role = "user";
    let db = (await connectDB).db("fxtest");
    await db.collection("user_cred").insertOne(req.body);
    res.status(200).redirect("/");
  }
}
