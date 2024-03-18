import Result from "./result";
import "./result.css";

export default function result() {
  return (
    <>
      <div className="admin-navbar">
        <span>Admin1</span>
        <span>회원관리</span>
        <span>예치환급관리</span>
        <span>주문내역</span>
        <span>결과 관리</span>
      </div>
      <div className="admin-container">
        <Result />
      </div>
    </>
  );
}
