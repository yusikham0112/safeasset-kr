"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./login.css";
import axios from "axios";

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
      e.target.pw.value = "";
    } else {
      await fetch("/api/loginLog")
        .then((res) => res.json())
        .then((data) => console.log(data));
      // router.push("/");
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
