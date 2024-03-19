import Link from "next/link";

import("./main.css");

export default function Home() {
  return (
    <>
      <div className="main-container">
        <div className="logo">
          <span> LOGO</span>
        </div>
        <div className="ment">가장 신뢰받는 글로벌 선도 거래</div>
        <div>
          안전하게 투명한 시스템으로 빠르고 편리한 옵션 거래를 제공합니다.
        </div>
        <div>
          <Link href={"/trade"}>
            <button className="root-button">거래하기</button>
          </Link>
          <Link href={"/register"}>
            <button className="root-button">회원가입</button>
          </Link>
        </div>
      </div>
    </>
  );
}
