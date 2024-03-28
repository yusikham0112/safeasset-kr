"use client";

import Link from "next/link";
import { getDWList } from "./action";
import { useEffect, useState } from "react";

export default function DWList() {
  const [historyList, setHistoryList] = useState([]);
  const holderInfo = async () => {
    setHistoryList(await getDWList());
  };

  useEffect(() => {
    holderInfo();
  }, []);

  return (
    <div className="deposit-container">
      <h3>Transaction History</h3>
      <h1>입출금내역</h1>
      <div className="b-menu">
        <div className="non-active-menu">
          <Link href="/deposit">출금신청</Link>
        </div>
        <div className="non-active-menu">
          <Link href="/withdrawl">출금신청</Link>
        </div>
        <div className="active-menu">입출금내역</div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>신청일시</th>
              <th>구분</th>
              <th>금액</th>
              <th>처리상태</th>
            </tr>
          </thead>
          <tbody>
            {historyList.map((e, i) => {
              return (
                <tr key={i}>
                  <td>{e.date}</td>
                  <td>{e.type == "예치" ? "입금" : "출금"}</td>
                  <td>{e.amount}</td>
                  <td>{e.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Modal() {}
