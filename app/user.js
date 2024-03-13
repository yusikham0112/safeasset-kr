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
        <span>
          {user.balance
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
          원
        </span>
        <span>{user.name} 님</span>
        <button
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
        <Link href={"/login"}>로그인</Link>
      </>
    );
  }
}
