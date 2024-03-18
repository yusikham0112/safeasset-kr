import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { connectDB } from "@/util/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserInfo from "./user";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });
const notoSansKr = Noto_Sans_KR({
  weight: ["500"],
  subsets: ["latin"],
});

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
            <Link href={"/trade?symbol=BTCUSDT&interval=1m"}>
              <span>거래내역</span>
            </Link>
            <Link href={"/deposit"}>
              <span>입출금</span>
            </Link>
            <Link href={"/ticket"}>
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
