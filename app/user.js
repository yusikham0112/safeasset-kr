"use client";

import { useEffect, useState } from "react";
import { getUserInfo } from "./getUserInfo";

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
  return (
    <>
      <span>
        {user.balance
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
        원
      </span>
      <span>{user.name} 님</span>
    </>
  );
}
