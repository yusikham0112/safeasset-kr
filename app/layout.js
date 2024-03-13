import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { connectDB } from "@/util/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserInfo from "./user";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sample",
  description: "Sample fxtest",
};

export default async function RootLayout({ children }) {
  let session = await getServerSession(authOptions);
  let user;
  if (session) {
    const db = (await connectDB).db("fxtest");
    user = await db.collection("user_cred").findOne({ id: session.user.id });
    user.balance = user.balance
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="navbar">
          <Link href={"/"}>
            <h1>LOGO</h1>
          </Link>
          <Link href={"/trade"}>
            <h3>거래</h3>
          </Link>
          <Link href={"/deposit"}>
            <h3>예치</h3>
          </Link>
          <div>
            <UserInfo />
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
