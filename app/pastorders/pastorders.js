"use client";

import Link from "next/link";
import { getPastOrderList } from "./action";
import { useEffect, useState } from "react";

export default function PastOrders() {
  const [historyList, setHistoryList] = useState([]);
  const holderInfo = async () => {
    setHistoryList(await getPastOrderList());
  };

  useEffect(() => {
    holderInfo();
  }, []);

  return (
    <div className="deposit-container">
      <h3>Trade History</h3>
      <h1>거래 내역</h1>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>(회차)날짜</th>
              <th>종목</th>
              <th>종류</th>
              <th>결과</th>
              <th>금액</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {historyList.map((order, i) => {
              if (order.result == "pending") {
                order.resultType = "?";
              } else if (order.result == "gain") {
                order.resultType = order.type;
              } else {
                order.resultType = order.type == "long" ? "short" : "long";
              }

              return (
                <tr key={i}>
                  <td>{order.round + order.date}</td>
                  <td>{order.symbol + " - " + order.interval}</td>

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
                        order.resultType == "long"
                          ? "rgb(10, 182, 123)"
                          : "rgb(225, 52, 71)",
                    }}
                  >
                    {capitalizeFirstLetter(order.resultType)}
                  </td>
                  <td>
                    {order.amount
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                  <td
                    style={{
                      color:
                        order.result == "pending"
                          ? ""
                          : order.result == "gain"
                          ? "rgb(10, 182, 123)"
                          : "rgb(225, 52, 71)",
                    }}
                  >
                    {capitalizeFirstLetter(order.result)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function Modal() {}
