import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { connectDB } from "@/util/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserInfo from "./user";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });
const notoSansKr = Noto_Sans_KR({
  weight: ["500"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Safe Assets Korea",
  description: "",
};

export default async function RootLayout({ children }) {
  let session = await getServerSession(authOptions);
  let user;
  if (session) {
    const db = (await connectDB).db("fxtest");
    user = await db.collection("user_cred").findOne({ id: session.user.id });
    console.log(session.user);
    user.balance = user.balance
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="navbar">
          <div className="logo-tag">
            <Link href={"/"}>
              <Image
                src="/logofx.png" // `public` 폴더 기준 상대 경로
                alt="logo"
                width={70} // 이미지의 폭
                height={50} // 이미지의 높이
              />
            </Link>
            <a href={"/trade?symbol=BTCUSDT&interval=1"}>
              <span>옵션거래</span>
            </a>
            <Link href={"/pastorders"}>
              <span>거래내역</span>
            </Link>
            <Link href={"/deposit"}>
              <span>입출금</span>
            </Link>
            <Link href={"/notice"}>
              <span>고객센터</span>
            </Link>
            <Link href={"/message"}>
              <span>메세지</span>
            </Link>
          </div>
          <div className="user-info">
            <UserInfo />
          </div>
        </div>
        {children}
        <div className="footer">
          <Image
            src="/logofx.png" // `public` 폴더 기준 상대 경로
            alt="logo"
            width={150} // 이미지의 폭
            height={100} // 이미지의 높이
          />
          <p>
            대표이사 (주) 비봉에이엔씨 외1명
            <br />
            ISMS 인증 유효기간: 2023.10.17 ~ 2024.10.16
            <br />
            정보보호 공시 이행 유효기간 : 2023.09.07 ~ 2024.09.07
            <br />
            과학기술정보통신부 선정, 정보보호 투자/공시 우수 기관·단체
          </p>
        </div>
      </body>
    </html>
  );
}
