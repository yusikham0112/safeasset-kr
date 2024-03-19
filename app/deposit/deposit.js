"use client";

import Link from "next/link";
import { getHolder, requestDeposit } from "./action";
import { useEffect, useState } from "react";

export default function Deposit() {
  const [holder, setHolder] = useState();
  const [depositAmount, setDepositAmount] = useState();
  const holderInfo = async () => {
    setHolder(await getHolder());
  };

  useEffect(() => {
    holderInfo();
  }, []);

  return (
    <div className="deposit-container">
      <h3>Deposit</h3>
      <h1>입금신청</h1>
      <div className="b-menu">
        <div className="active-menu">입금신청</div>
        <div className="non-active-menu">
          <Link href="/withdrawl">출금신청</Link>
        </div>
        <div className="non-active-menu">
          <Link href="/dwlist">입출금내역</Link>
        </div>
      </div>
      <div
        className="input-label"
        style={{ left: "8px", position: "relative" }}
      >
        <label>신청금액</label>
        <div className="input-wrapper">
          <input
            type="number"
            defaultValue={0}
            id="amount"
            name="amount"
            onChange={(e) => {
              setDepositAmount(e.target.value);
            }}
          ></input>
          <span>원</span>
        </div>
      </div>
      <div className="input-label" readOnly>
        <label>입금자명</label>
        <input value={holder} readOnly></input>
      </div>

      <button
        onClick={() => {
          requestDeposit(depositAmount);
          alert("입금 신청이 완료되었습니다.");
        }}
      >
        신청
      </button>
    </div>
  );
}

function Modal() {}
