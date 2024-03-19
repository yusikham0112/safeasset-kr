"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import TradingViewWidget from "./TradingViewWidget";
import { Order } from "./action";
import { getPastResult } from "./getPastResult";
import { getPastOrder } from "./getPastOrder";
import "./trade.css";

require("dotenv").config();

export default function Trade() {
  const [price, setPrice] = useState("NaN");
  const [percentColor, setPercentColor] = useState("red");
  const [orderPrice, setOrderPrice] = useState(0);
  const [userAmount, setUserAmount] = useState(7777777);
  const [orderHour, setOrderHour] = useState(new Date().getHours());
  const [orderMin, setOrderMin] = useState(new Date().getMinutes());
  const [sec, setSec] = useState(new Date().getSeconds());
  const [isDisabled, setIsDisabled] = useState(true);
  const [pastResult, setPastResult] = useState([1]);
  const [pastOrder, setPastOrder] = useState([]);
  const orderRef = useRef();
  let symbol = "BTCUSDT";
  let interval = "1";
  const params = new URLSearchParams(window.location.search);

  if (params.get("symbol")) {
    symbol = params.get("symbol");
  }
  if (params.get("interval")) {
    interval = params.get("interval");
  }

  const getdata = async () => {
    setOrderHour(new Date().getHours());

    let minData;

    if (new Date().getMinutes() % interval == 0) {
      setOrderMin(new Date().getMinutes());
      setSec(60 - new Date().getSeconds());
      if (60 - new Date().getSeconds() < 30) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    } else {
      minData = Math.floor(new Date().getMinutes() / interval + 1) * interval;
      setOrderMin(minData);
      if (minData == 0) {
        setOrderHour(new Date().getHours() + 1);
      }
      minData = (minData - new Date().getMinutes()) * 60;
      setSec(60 - new Date().getSeconds() + minData);
      if (60 - new Date().getSeconds() + minData < 30) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }

    // if (new Date().getMinutes() % interval != 0) {
    //   minData = Math.floor(new Date().getMinutes() / interval + 1) * interval;
    //   setOrderMin(minData);
    //   minData = (minData - new Date().getMinutes() - 1) * 60;
    //   setSec(60 - new Date().getSeconds() + minData);
    //   if (60 - new Date().getSeconds() + minData < 30) {
    //     setIsDisabled(true);
    //   } else {
    //     setIsDisabled(false);
    //   }
    // } else {
    //   setOrderMin(new Date().getMinutes() + +interval);
    //   setSec(60 - new Date().getSeconds() + 60 * (+interval - 1));
    //   if (60 - new Date().getSeconds() + 60 * (+interval - 1) < 30) {
    //     setIsDisabled(true);
    //   } else {
    //     setIsDisabled(false);
    //   }
    // }

    if (new Date().getSeconds() == 3) {
      setPastResult(await getPastResult(symbol, interval + "m"));
    }

    setPastOrder(await getPastOrder(symbol, interval + "m"));

    try {
      const data = await axios.get("/api/getprice");
      setPrice(Number(data.data).toFixed(2));
    } catch (err) {
      console.log(err);
    }
  };

  const getFirstData = async () => {
    setPastOrder(await getPastOrder(symbol, interval + "m"));
    setPastResult(await getPastResult(symbol, interval + "m"));
  };

  const showAmountController = (amount) => {
    return (
      <AmountCotroller
        amount={amount}
        orderRef={orderRef}
        orderPrice={orderPrice}
        setOrderPrice={setOrderPrice}
        userAmount={userAmount}
      />
    );
  };

  const dateFormConvert = (date) => {
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
  };

  useEffect(() => {
    getFirstData();
    setInterval(() => {
      getdata();
    }, 1000);
  }, []);

  return (
    <>
      <div className="trade-container">
        <div className="chart-wrap">
          <TradingViewWidget />
        </div>
        <div className="order-wrap">
          <div className="coin-info">
            <img
              src="vercel.svg"
              alt="My Happy SVG"
              style={{ width: "33px" }}
            />
            <div className="coin-info-wrap">
              <div>
                <span>{}</span>
                <div class="dropdown">
                  <button class="dropdown-button">
                    {`${symbol} ${interval}분 ▼`}
                  </button>
                  <div class="dropdown-content">
                    <a href="/trade?interval=1&symbol=BTCUSDT">BTCUSDT 1M</a>
                    <a href="/trade?interval=2&symbol=BTCUSDT">BTCUSDT 2M</a>
                    <a href="/trade?interval=3&symbol=BTCUSDT">BTCUSDT 3M</a>
                    <a href="/trade?interval=5&symbol=BTCUSDT">BTCUSDT 5M</a>
                  </div>
                </div>
              </div>
              <div>
                <span className="coin-info-label">거래량 </span> NaN
              </div>
              <div>
                <span className="coin-info-label">하한가 </span>
                {price}
              </div>
            </div>
            <div className="coin-info-wrap">
              <div>
                <span className="coin-info-label">현재가 </span>
                {price}
              </div>
              <div>
                <span style={{ color: percentColor }}>NaN% </span>
              </div>
              <div>
                <span className="coin-info-label">상한가 </span>
                {price}
              </div>
            </div>
          </div>
          <div className="time-info">
            <div className="time-wrap">
              <div className="time-label">
                <span>계약 시간</span>
              </div>
              <div className="time-data">
                <span>
                  {orderMin == 60 ? orderHour : orderHour}시
                  {orderMin == 60 ? "00" : orderMin}분
                </span>
              </div>
            </div>
            <div className="time-wrap">
              <div className="time-label">
                <span>계약 회차</span>
              </div>
              <div className="time-data">
                <span>
                  {orderMin == 60 ? orderHour : orderHour}시
                  {orderMin == 60 ? "00" : orderMin}분
                </span>
              </div>
            </div>
            <div className="time-wrap">
              <div className="time-label">
                <span>남은 시간</span>
              </div>
              <div className="time-data">
                <span>{sec}초</span>
              </div>
            </div>
          </div>
          <div className="order-info">
            <div className="amount-wrap">
              <input
                id="order-amount"
                type="number"
                ref={orderRef}
                defaultValue={orderPrice}
                onChange={(e) => {
                  setOrderPrice(Number(e.target.value));
                }}
              ></input>
              <button
                className="reset-button"
                onClick={() => {
                  orderRef.current.value = 0;
                  setOrderPrice(0);
                }}
              >
                초기화
              </button>
            </div>
            {showAmountController(10000)}
            {showAmountController(30000)}
            {showAmountController(50000)}
            {showAmountController(100000)}
            {showAmountController(300000)}
            <div className="amount-wrap">
              <button
                className="long-button"
                disabled={isDisabled}
                onClick={async () => {
                  orderRef.current.value = 0;
                  setOrderPrice(0);
                  let msg = await Order(
                    orderPrice,
                    "long",
                    symbol,
                    interval + "m"
                  );
                  console.log(msg);
                  getFirstData();
                }}
              >
                Long
              </button>
              <button
                className="short-button"
                disabled={isDisabled}
                onClick={async () => {
                  orderRef.current.value = 0;
                  setOrderPrice(0);
                  let msg = await Order(
                    orderPrice,
                    "short",
                    symbol,
                    interval + "m"
                  );
                  console.log(msg);
                  getFirstData();
                }}
              >
                Short
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="list-container">
        <div className="past-result-wrap">
          <table>
            <thead>
              <tr>
                <th>거래결과</th>
                <th>종가</th>
                <th>결과</th>
              </tr>
            </thead>
            <tbody>
              {pastResult.map((user, i) => (
                <tr key={i}>
                  <td>{user.round + dateFormConvert(user.date)}</td>
                  <td>
                    {parseFloat(user.price)
                      .toFixed(2)
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                  <td
                    style={{
                      color:
                        user.result == "Long"
                          ? "rgb(10, 182, 123)"
                          : "rgb(225, 52, 71)",
                    }}
                  >
                    {user.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="past-order-wrap">
          <table>
            <thead>
              <tr>
                <th>거래내역</th>
                <th>금액</th>
                <th>구분</th>
                <th>결과</th>
                <th>실현금액</th>
              </tr>
            </thead>
            <tbody>
              {pastOrder.map((order, i) => (
                <tr key={i}>
                  <td>{order.round + dateFormConvert(order.date)}</td>
                  <td>
                    {order.amount
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                  <td
                    style={{
                      color:
                        order.type == "long"
                          ? "rgb(10, 182, 123)"
                          : "rgb(225, 52, 71)",
                    }}
                  >
                    {capitalizeFirstLetter(order.type)}
                  </td>
                  <td
                    style={{
                      color:
                        order.result == "pending"
                          ? ""
                          : order.result == "long"
                          ? "rgb(10, 182, 123)"
                          : "rgb(225, 52, 71)",
                    }}
                  >
                    {capitalizeFirstLetter(order.result)}
                  </td>
                  <td
                    style={{
                      color:
                        order.result == "pending"
                          ? ""
                          : order.type == order.result
                          ? "rgb(10, 182, 123)"
                          : "rgb(225, 52, 71)",
                    }}
                  >
                    {order.result == "pending"
                      ? "?"
                      : order.type == order.result
                      ? (order.amount * process.env.NEXT_PUBLIC_RR_RATIO)
                          .toString()
                          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                      : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function AmountCotroller(props) {
  return (
    <div className="amount-wrap">
      <button
        className="control-button"
        onClick={() => {
          props.orderPrice - props.amount > 0
            ? ((props.orderRef.current.value = props.orderPrice - props.amount),
              props.setOrderPrice(props.orderPrice - props.amount))
            : ((props.orderRef.current.value = 0), props.setOrderPrice(0));
        }}
      >
        -
      </button>
      <div className="control-amount">
        <span>
          {props.amount
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
        </span>
      </div>
      <button
        className="control-button"
        onClick={() => {
          props.orderRef.current.value = props.orderPrice + props.amount;
          props.setOrderPrice(props.orderPrice + props.amount);
        }}
      >
        +
      </button>
      <button
        className="reset-button"
        onClick={() => {
          props.orderRef.current.value = props.userAmount;
          props.setOrderPrice(props.userAmount);
        }}
      >
        최대
      </button>
    </div>
  );
}
