"use client";

import Link from "next/link";
import { postTicket } from "./action";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendTicket() {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const router = useRouter();

  return (
    <div className="deposit-container">
      <h3>Help Center</h3>
      <h1>1:1 문의</h1>
      <div className="b-menu">
        <div className="non-active-menu">
          <Link href="/notice">공지사항</Link>
        </div>
        <div className="active-menu">1:1 문의</div>
      </div>

      <input
        placeholder="제목을 입력해주세요."
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      ></input>
      <textarea
        placeholder="내용을 입력해주세요."
        onChange={(e) => {
          setContent(e.target.value);
        }}
      ></textarea>

      <button
        onClick={() => {
          postTicket(title, content);
          alert("문의 신청이 완료되었습니다.");
          router.push("/ticket");
        }}
      >
        신청
      </button>
    </div>
  );
}

function Modal() {}
