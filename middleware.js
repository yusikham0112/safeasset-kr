import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const currentPath = request.nextUrl.pathname;
  const token = await getToken({ req: request });
  const session = await getSession({ request });
  const pathList = [
    "/trade",
    "/deposit",
    "/admin",
    "/withdrawl",
    "/dwlist",
    "/ticket",
    "/sendticket",
    "/pastorders",
  ];

  // 경로 배열을 순회하면서 로그인이 필요한 페이지인지 확인
  const requiresLogin = pathList.some((path) => currentPath.startsWith(path));
  console.log(session);
  console.log(token);

  // 로그인이 필요한 페이지에 접근한 경우
  if (requiresLogin && !token) {
    console.log("Could not get token");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 로그인이 필요한 페이지인 경우에만 관리자 권한을 확인하고 리다이렉트
  if (
    currentPath.startsWith("/admin") &&
    token &&
    token.user.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 모든 조건을 통과한 경우 다음 미들웨어 함수로 요청을 전달
  return NextResponse.next();
}
