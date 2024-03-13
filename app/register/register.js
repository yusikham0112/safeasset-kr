"use client";

import "./register.css";

export default function Signup() {
  return (
    <div className="signup-container">
      <form method="POST" action="/api/auth/signup" className="signup-form">
        <input
          name="id"
          type="text"
          placeholder="아이디"
          minLength={4}
          required
        />
        <input
          name="name"
          type="text"
          placeholder="이름"
          minLength={2}
          required
        />
        <input
          name="pw"
          type="password"
          placeholder="비밀번호"
          minLength={4}
          required
        />
        <input
          name="pwConfirm"
          type="password"
          placeholder="비밀번호 확인"
          minLength={4}
          required
        />
        <input
          name="nick"
          type="text"
          placeholder="닉네임"
          minLength={4}
          required
        />
        <input
          name="birth"
          type="text"
          placeholder="생년월일"
          maxLength={8}
          minLength={8}
          required
        />
        <input
          name="phone"
          type="text"
          placeholder="전화번호"
          minLength={11}
          maxLength={11}
          required
        />
        <input
          name="holder"
          type="text"
          placeholder="예금주"
          minLength={2}
          required
        />
        <input name="account" type="text" placeholder="계좌번호" required />
        <input name="bank" type="text" placeholder="은행" required />
        <input name="ref" type="text" placeholder="지점" required />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}
