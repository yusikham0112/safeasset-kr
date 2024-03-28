"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./login.css";
import axios from "axios";
import { postLog } from "./action";

export default function Signin() {
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = e.target.id.value;
    const pw = e.target.pw.value;

    const result = await signIn("credentials", {
      id: id,
      pw: pw,
      redirect: false,
    });
    if (result.error) {
      alert("승인된 아이디가 아니거나, 아이디 비밀번호가 일치하지 않습니다.");
      e.target.pw.value = "";
    } else {
      const res = await axios.get("/api/getip");
      postLog(res.data.ip);
      router.push("/");
    }
  };
  return (
    <div className="login-container">
      <div className="login-wrap">
        <form onSubmit={handleSubmit} className="login-form">
          <input name="id" type="text" placeholder="아이디" />
          <input name="pw" type="password" placeholder="비번" />
          <button type="submit">로그인</button>
          <span>
            계정이 없나요?{" "}
            <a href="/register" style={{ color: "green" }}>
              회원가입
            </a>
          </span>
        </form>
      </div>
    </div>
  );
}
