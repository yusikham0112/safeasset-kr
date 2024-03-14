"use client";

import { useEffect, useState } from "react";
import { getUserInfo } from "./getUserInfo";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function UserInfo() {
  const [user, setUser] = useState({ balance: 0 });
  const getUser = async () => {
    setUser(await getUserInfo());
  };
  useEffect(() => {
    setInterval(() => {
      getUser();
    }, 1000);
  }, []);
  if (user) {
    return (
      <>
        <div className="user-detail">
          <span>{user.name} 님</span>
          <span>
            {user.balance
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
            KRW
          </span>
        </div>
        <button
          className="official-button"
          onClick={() => {
            signOut({ callbackUrl: "/login" });
          }}
        >
          로그아웃
        </button>
      </>
    );
  } else {
    return (
      <>
        <Link href={"/login"}>
          <button className="official-button">로그인</button>
        </Link>
      </>
    );
  }
}
