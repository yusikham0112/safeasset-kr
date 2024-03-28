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
        <select name="bank">
          <option value=""> 은행 선택 </option>
          <option value="광주은행">광주은행</option>
          <option value="경남은행">경남은행</option>
          <option value="국민은행">국민은행</option>
          <option value="기업은행">기업은행</option>
          <option value="농협">농협</option>
          <option value="대구은행">대구은행</option>
          <option value="부산은행">부산은행</option>
          <option value="산림조합">산림조합</option>
          <option value="산업은행">산업은행</option>
          <option value="새마을금고">새마을금고</option>
          <option value="수협">수협</option>
          <option value="신한은행">신한은행</option>
          <option value="신협">신협</option>
          <option value="씨티은행">씨티은행</option>
          <option value="우리은행">우리은행</option>
          <option value="우체국">우체국</option>
          <option value="전북은행">전북은행</option>
          <option value="제주은행">제주은행</option>
          <option value="카카오뱅크">카카오뱅크</option>
          <option value="케이뱅크">케이뱅크</option>
          <option value="KEB하나은행">KEB하나은행</option>
          <option value="SC제일은행">SC제일은행</option>
          <option value="토스뱅크">토스뱅크</option>
        </select>

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}
