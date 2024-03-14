"use client";

import Link from "next/link";
import { getFullbank, requestWithdrawl } from "./action";
import { useEffect, useRef, useState } from "react";

export default function Withdrawl() {
  const [bank, setBank] = useState({ info: "", balance: 0 });
  const [withdrawlAmount, setWithdrawlAmount] = useState();
  const amountRef = useRef();
  const bankInfo = async () => {
    setBank(await getFullbank());
  };

  useEffect(() => {
    bankInfo();
  }, []);

  return (
    <div className="deposit-container">
      <h3>Deposit</h3>
      <h1>입금신청</h1>
      <div className="b-menu">
        <div className="non-active-menu">
          <Link href="/deposit">입금신청</Link>
        </div>
        <div className="active-menu">출금신청</div>
        <div className="non-active-menu">입출금내역</div>
      </div>
      <div
        className="input-label"
        style={{ left: "8px", position: "relative" }}
      >
        <label>신청금액</label>
        <div className="input-wrapper">
          <input
            ref={amountRef}
            type="number"
            defaultValue={0}
            max={bank.balance}
            id="amount"
            name="amount"
            onChange={(e) => {
              amountRef.current.value > bank.balance
                ? (amountRef.current.value = bank.balance)
                : "";
              setWithdrawlAmount(e.target.value);
            }}
          ></input>
          <span>원</span>
        </div>
      </div>
      <div className="input-label" readOnly>
        <label>출금계좌</label>
        <input value={bank.info} readOnly></input>
      </div>

      <button
        onClick={() => {
          requestWithdrawl(withdrawlAmount);
          alert("출금 신청이 완료되었습니다.");
        }}
      >
        신청
      </button>
    </div>
  );
}

function Modal() {}
