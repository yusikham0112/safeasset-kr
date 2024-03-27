import Link from "next/link";
import TradingViewWidget from "./tradingVW";
import Image from "next/image";

import("./main.css");

export default function Home() {
  return (
    <>
      <div className="main-container">
        <div className="logo">
          <Image
            src="/logofx.png" // `public` 폴더 기준 상대 경로
            alt="logo"
            width={200} // 이미지의 폭
            height={150} // 이미지의 높이
          />
        </div>
        <div className="ment">가장 신뢰받는 글로벌 선도 거래</div>
        <div className="sub">
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
        <div className="flex-box">
          <div className="small-widget-container">
            <TradingViewWidget symbol="BINANCE:BTCUSDT" />
          </div>
          <div className="small-widget-container">
            <TradingViewWidget symbol="BINANCE:ETHUSDT" />
          </div>
        </div>
      </div>
      <div className="content-wrap">
        <h4>월드 클래스</h4>
        <h2>트레이딩 플랫폼</h2>
        <div className="flex-box">
          <div className="content-box">
            <Image
              src="/image1.png" // `public` 폴더 기준 상대 경로
              alt="img1"
              width={112.8} // 이미지의 폭
              height={109.13} // 이미지의 높이
            />
            <div>
              <h2>수상 경력이 있는 플랫폼</h2>
              <p>
                업계에서 가장 우수한 플랫폼, 최첨단 코어로 편리한 트레이딩
                환경을 선사합니다.
              </p>
            </div>
          </div>
          <div className="content-box">
            <Image
              src="/image2.png" // `public` 폴더 기준 상대 경로
              alt="img1"
              width={112.8} // 이미지의 폭
              height={109.13} // 이미지의 높이
            />
            <div>
              <h2>사용자 지정 인터페이스</h2>
              <p>
                필요에 따라 인터페이스를 구성합니다. 레이아웃, 테마를 구성하고
                알림을 설정하십시오.
              </p>
            </div>
          </div>
          <div className="content-box">
            <Image
              src="/image3.png" // `public` 폴더 기준 상대 경로
              alt="img1"
              width={112.8} // 이미지의 폭
              height={109.13} // 이미지의 높이
            />
            <div>
              <h2>편리한 출금</h2>
              <p>다양한 결제 시스템을 이용하여 자금을 즉시 인출합니다.</p>
            </div>
          </div>
        </div>
        <div className="flex-box">
          <div className="content-box">
            <Image
              src="/image4.png" // `public` 폴더 기준 상대 경로
              alt="img1"
              width={112.8} // 이미지의 폭
              height={109.13} // 이미지의 높이
            />
            <div>
              <h2>연중무휴 지원</h2>
              <p>당사의 전문 지원팀은 항상 귀하의 언어로 지원합니다.</p>
            </div>
          </div>
          <div className="content-box">
            <Image
              src="/image5.png" // `public` 폴더 기준 상대 경로
              alt="img1"
              width={112.8} // 이미지의 폭
              height={109.13} // 이미지의 높이
            />
            <div>
              <h2>처음부터 직관적인 경험.</h2>
              <p>
                첫날부터, 우리는 새로운 사람들과 전문가들 모두를 위해 능률적인
                거래 솔루션을 설계하고 구축했습니다. 손쉬운 입출금, 포트폴리오
                및 모든 암호화폐를 한 곳에서 편리하게 추적할 수 있습니다.
              </p>
            </div>
          </div>
          <div className="content-box">
            <Image
              src="/image6.png" // `public` 폴더 기준 상대 경로
              alt="img1"
              width={112.8} // 이미지의 폭
              height={109.13} // 이미지의 높이
            />
            <div>
              <h2>업계 최상위 보안 시스템</h2>
              <p>
                사용자 정보와 자금의 보안이 우리의 최우선 과제입니다. ISMS 인증
                획득, 5·5·7 규정 준수, 지갑분리 및 각종 보안 솔루션으로 고객님의
                자산을 안전하게 보관하고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
