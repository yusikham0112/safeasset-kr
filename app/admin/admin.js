"use client";

import { useEffect, useState } from "react";
import {
  getUserList,
  getDWList,
  manageDWStatus,
  getOrderList,
  editOrder,
} from "./adminAPI";
import Link from "next/link";

export default function Admin() {
  const [page, setPage] = useState(0);

  return (
    <>
      <div className="admin-navbar">
        <span
          onClick={() => {
            setPage(0);
          }}
        >
          Admin1
        </span>
        <span
          onClick={() => {
            setPage(1);
          }}
        >
          회원관리
        </span>
        <span
          onClick={() => {
            setPage(2);
          }}
        >
          예치환급관리
        </span>
        <span
          onClick={() => {
            setPage(3);
          }}
        >
          주문내역
        </span>
        <span
          onClick={() => {
            setPage(4);
          }}
        >
          결과 관리
        </span>
      </div>
      <div className="admin-container">
        {page == 1 ? <UserManagement /> : ""}
        {page == 2 ? <DepositWithdrawalManagement /> : ""}
        {page == 3 ? <OrderList /> : ""}
        {page == 4 ? <ResultManagement /> : ""}
      </div>
    </>
  );
}

function OrderList() {
  const [orderList, setOrderList] = useState([]);
  const getOrders = async () => {
    setOrderList(await getOrderList());
  };
  useEffect(() => {
    setInterval(() => {
      getOrders();
    }, 1000);
  }, []);
  return (
    <>
      <h2>주문내역</h2>
      <input></input>
      <button>검색</button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>거래번호</th>
            <th>아이디</th>
            <th>이름</th>
            <th>종목</th>
            <th>게임</th>
            <th>회원픽</th>
            <th>결과</th>
            <th>거래금액</th>
            <th>상태</th>
            <th>날짜</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order, i) => (
            <tr key={i}>
              <td>{orderList.length - i}</td>
              <td>{order.id}</td>
              <td>{order.name}</td>
              <td>{order.symbol + "-" + order.interval}</td>
              <td>{order.game}</td>
              <td>{order.type}</td>
              <td>{order.game_result}</td>
              <td>{order.amount}</td>
              <td>
                {order.result == "gain"
                  ? "실현"
                  : order.result == "loss"
                  ? "실격"
                  : "진행 중"}
              </td>
              <td>{dateFormConvert(order.date)}</td>
              <td>
                {order.result == "pending" ? (
                  <button
                    onClick={() => {
                      let userInput = prompt(
                        "수정할 거래금액을 입력해주세요.",
                        order.amount
                      );
                      editOrder(order._id, userInput);
                    }}
                  >
                    수정
                  </button>
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function DepositWithdrawalManagement() {
  const [DWList, setDWList] = useState([]);
  const [actionDropdown, setActionDropdown] = useState([]);

  const changeDropdown = (i) => {
    let temp = actionDropdown;
    let save = DWList;
    temp[i] = temp[i] == "none" ? "" : "none";
    setActionDropdown(temp);
    setDWList([...DWList]);
    console.log(actionDropdown);
  };

  const getDW = async () => {
    let temp = [];
    let data = await getDWList();
    data.map((e) => {
      temp.push("none");
    });
    setActionDropdown(temp);
    setDWList(data);
  };

  useEffect(() => {
    getDW();
  }, []);
  return (
    <>
      <h2>예치/환급관리</h2>
      <input></input>
      <button>검색</button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>유형</th>
            <th>금액</th>
            <th>은행</th>
            <th>지점</th>
            <th>아이디</th>
            <th>회원명</th>
            <th>닉네임</th>
            <th>상태</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {DWList.map((req, i) => (
            <tr key={i}>
              <td>{dateFormConvert(req.date)}</td>
              <td>{req.type}</td>
              <td>{req.amount}</td>
              <td>{req.full_bank}</td>
              <td>{req.ref}</td>
              <td>{req.id}</td>
              <td>{req.name}</td>
              <td>{req.nick}</td>
              <td>{req.status}</td>
              <td>
                <button
                  onClick={() => {
                    changeDropdown(i);
                  }}
                >
                  처리
                </button>
                <div
                  id="dropdownContent"
                  style={{ display: actionDropdown[i] }}
                >
                  {req.status == "승인대기중" ? (
                    <button
                      onClick={async () => {
                        await manageDWStatus(req._id, "승인");
                        getDW();
                      }}
                    >
                      승인
                    </button>
                  ) : (
                    ""
                  )}
                  {req.status == "승인대기중" ? (
                    <button
                      onClick={async () => {
                        await manageDWStatus(req._id, "거절");
                        getDW();
                      }}
                    >
                      거절
                    </button>
                  ) : (
                    ""
                  )}
                  {req.status == "승인" ? (
                    <button
                      onClick={async () => {
                        await manageDWStatus(req._id, "취소");
                        getDW();
                      }}
                    >
                      취소
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function ResultManagement() {
  const [userList, setUserList] = useState([]);
  const getUser = async () => {
    setUserList(await getUserList());
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <h2>총관리자 - 회원관리</h2>
      <input></input>
      <button>검색</button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>유저번호</th>
            <th>아이디</th>
            <th>닉네임</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>지점</th>
            <th>보유금</th>
            <th>최근IP</th>
            <th>상태</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user, i) => (
            <tr key={i}>
              <td>{user._id}</td>
              <td>{user.id}</td>
              <td>{user.nick}</td>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.ref}</td>
              <td>{user.balance}</td>
              <td>{user.last_ip}</td>
              <td>{user.status}</td>
              <td>
                <Link href={"/admin/result/" + user._id}>
                  <button>관리</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function UserManagement() {
  const [userList, setUserList] = useState([]);
  const getUser = async () => {
    setUserList(await getUserList());
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <h2>총관리자 - 회원관리</h2>
      <input></input>
      <button>검색</button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>유저번호</th>
            <th>아이디</th>
            <th>닉네임</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>지점</th>
            <th>보유금</th>
            <th>최근IP</th>
            <th>상태</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user, i) => (
            <tr key={i}>
              <td>{user._id}</td>
              <td>{user.id}</td>
              <td>{user.nick}</td>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.ref}</td>
              <td>{user.balance}</td>
              <td>{user.last_ip}</td>
              <td>{user.status}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function dateFormConvert(date) {
  if (date) {
    const data = date.toString();
    return (
      data.slice(0, 4) +
      "/" +
      data.slice(4, 6) +
      "/" +
      data.slice(6, 8) +
      " " +
      data.slice(8, 10) +
      ":" +
      data.slice(10, 12)
    );
  }
}
