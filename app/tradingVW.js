"use client";

import React, { useEffect, useRef } from "react";

export default function TradingViewWidget(props) {
  const container = useRef();

  useEffect(() => {
    // 스크립트 태그 생성
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.type = "text/javascript";
    // 위젯 설정
    script.innerHTML = JSON.stringify({
      symbol: props.symbol,
      locale: "kr",
      dateRange: "3M",
      colorTheme: "dark",
      isTransparent: false,
      autosize: true,
      largeChartUrl: "",
    });

    container.current.appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
    </div>
  );
}
