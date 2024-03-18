import Result from "./result";
import "./result.css";

export default function result() {
  return (
    <>
      <div className="admin-navbar">
        <a href="/admin?page=0">
          <span>Admin1</span>
        </a>
        <a href="/admin?page=1">
          <span>회원관리</span>
        </a>
        <a href="/admin?page=2">
          <span>예치환급관리</span>
        </a>
        <a href="/admin?page=3">
          <span>주문내역</span>
        </a>
        <a href="/admin?page=4">
          <span>1:1 문의</span>
        </a>
        <span>결과 관리</span>
      </div>
      <div className="admin-container">
        <Result />
      </div>
    </>
  );
}
