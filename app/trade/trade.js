"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import TradingViewWidget from "./TradingViewWidget";
import { Order } from "./action";
import { getPastResult } from "./getPastResult";
import { getPastOrder } from "./getPastOrder";

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

  const getdata = async () => {
    setOrderHour(new Date().getHours());
    setOrderMin(new Date().getMinutes());
    setSec(new Date().getSeconds());
    if (new Date().getSeconds() < 50) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    if (new Date().getSeconds() == 0) {
      setPastOrder(await getPastOrder("BTCUSDT", "1m"));
      setPastResult(await getPastResult("BTCUSDT", "1m"));
    }
    if (new Date().getSeconds() == 20) {
      setPastOrder(await getPastOrder("BTCUSDT", "1m"));
      setPastResult(await getPastResult("BTCUSDT", "1m"));
    }
    if (new Date().getSeconds() == 40) {
      setPastOrder(await getPastOrder("BTCUSDT", "1m"));
      setPastResult(await getPastResult("BTCUSDT", "1m"));
    }
    try {
      const data = await axios.get("/api/getprice");
      setPrice(Number(data.data).toFixed(2));
    } catch (err) {
      console.log(err);
    }
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
    getdata();
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
                <span>BTC 1분</span>
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
                  {orderMin == 59 ? orderHour + 1 : orderHour}시
                  {orderMin + 1 == 60 ? "00" : orderMin + 1}분
                </span>
              </div>
            </div>
            <div className="time-wrap">
              <div className="time-label">
                <span>남은 시간</span>
              </div>
              <div className="time-data">
                <span>{60 - sec}초</span>
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
                  let msg = await Order(orderPrice, "long", "BTCUSDT", "1m");
                  console.log(msg);
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
                  let msg = await Order(orderPrice, "short", "BTCUSDT", "1m");
                  console.log(msg);
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
                <th>거래시간</th>
                <th>시가</th>
                <th>결과</th>
              </tr>
            </thead>
            <tbody>
              {pastResult.map((user, i) => (
                <tr key={i}>
                  <td>{dateFormConvert(user.date)}</td>
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
                <th>거래시간</th>
                <th>금액</th>
                <th>구분</th>
                <th>결과</th>
                <th>실현금액</th>
              </tr>
            </thead>
            <tbody>
              {pastOrder.map((order, i) => (
                <tr key={i}>
                  <td>{dateFormConvert(order.date)}</td>
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
