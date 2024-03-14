import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { connectDB } from "@/util/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserInfo from "./user";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fxtest",
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
          <div className="logo-tag">
            <Link href={"/"}>LOGO</Link>
            <Link href={"/trade"}>
              <span>옵션거래</span>
            </Link>
            <Link href={"/trade"}>
              <span>거래내역</span>
            </Link>
            <Link href={"/deposit"}>
              <span>입출금</span>
            </Link>
            <Link href={"/deposit"}>
              <span>고객센터</span>
            </Link>
          </div>
          <div className="user-info">
            <UserInfo />
          </div>
        </div>
        {children}
        <div className="footer">footer</div>
      </body>
    </html>
  );
}
