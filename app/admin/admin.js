"use client";

import { useEffect, useRef, useState } from "react";
import {
  getUserList,
  getDWList,
  manageDWStatus,
  getOrderList,
  editOrder,
  getTicketList,
  editTicket,
  userStatusChagne,
  updateUserDetail,
  changeOrderPosition,
  getNotice,
  editNotice,
  deleteNotice,
  insertNotice,
  editBalance,
  editRemote,
  postUserMessage,
} from "./adminAPI";
import Link from "next/link";

export default function Admin() {
  let pageNum = 0;
  const [page, setPage] = useState(0);
  const params = new URLSearchParams(window.location.search);

  if (params.get("page")) {
    pageNum = +params.get("page");
  }

  useEffect(() => {
    setPage(pageNum);
  }, []);

  return (
    <>
      <div className="admin-navbar">
        <span
          onClick={() => {
            setPage(0);
          }}
        >
          공지 관리
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
          1:1 문의
        </span>
        <a href="/admin/result">
          <span>결과 관리</span>
        </a>
      </div>
      <div className="admin-container">
        {page == 0 ? <NoticeManagement /> : ""}
        {page == 1 ? <UserManagement /> : ""}
        {page == 2 ? <DepositWithdrawalManagement /> : ""}
        {page == 3 ? <OrderList /> : ""}
        {page == 4 ? <TicketManagement /> : ""}
        {page == 5 ? <ResultManagement /> : ""}
      </div>
    </>
  );
}

function NoticeManagement() {
  const [noticeList, setNoticeList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [modalNotice, setModalNotice] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    getList();
  };

  const openModal2 = () => {
    setIsModalOpen2(true);
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
    getList();
  };

  const getList = async () => {
    setNoticeList(await getNotice());
  };

  const del = async (id) => {
    await deleteNotice(id);
    getList();
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      {isModalOpen ? (
        <NoticeManagementModal notice={modalNotice} closeModal={closeModal} />
      ) : (
        ""
      )}
      {isModalOpen2 ? <InsertNoticeModal closeModal={closeModal2} /> : ""}
      <h2>공지사항 관리</h2>
      <button onClick={openModal2}>새로운 공지 등록</button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>고유번호</th>
            <th>제목</th>
            <th>등록일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {noticeList.map((notice, i) => (
            <tr key={i}>
              <td>{notice._id}</td>
              <td>{notice.title}</td>
              <td>{dateFormConvert(notice.date)}</td>
              <td>
                <button
                  onClick={() => {
                    setModalNotice(notice);
                    openModal();
                  }}
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    del(notice._id);
                  }}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function InsertNoticeModal({ closeModal }) {
  const [content, setContent] = useState();
  const [title, setTitle] = useState();

  const insert = async (newTitle, newContent) => {
    await insertNotice(newTitle, newContent);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>새로운 공지사항 등록</h2>
        <input
          placeholder="제목을 입력하세요."
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        ></input>
        <div>
          <textarea
            placeholder="답변을 입력하세요."
            onChange={(e) => {
              setContent(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="button-box">
          <button
            onClick={() => {
              closeModal();
            }}
          >
            닫기
          </button>
          <button
            onClick={() => {
              insert(title, content);
              closeModal();
            }}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

function NoticeManagementModal({ notice, closeModal }) {
  const [content, setContent] = useState(notice.content);
  const [date, setDate] = useState(notice.date);

  const edit = async (newContent, newDate) => {
    await editNotice(notice._id, newContent, newDate);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>공지사항 조회/수정 - {notice._id}</h2>
        <input
          type="number"
          maxLength={12}
          minLength={12}
          defaultValue={notice.date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        ></input>
        <p>제목 : {notice.title}</p>
        <div>
          <textarea
            placeholder="답변을 입력하세요."
            defaultValue={notice.content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="button-box">
          <button
            onClick={() => {
              closeModal();
            }}
          >
            닫기
          </button>
          <button
            onClick={() => {
              edit(content, date);
              closeModal();
            }}
          >
            수정
          </button>
        </div>
      </div>
    </div>
  );
}

function TicketManagement() {
  const [ticketList, setTicketList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTicket, setModalTicket] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    getTickets();
  };

  const getTickets = async () => {
    setTicketList(await getTicketList());
  };
  useEffect(() => {
    getTickets();
  }, []);
  return (
    <>
      {isModalOpen ? (
        <TicketManagementModal ticket={modalTicket} closeModal={closeModal} />
      ) : (
        ""
      )}
      <h2>1:1 문의 관리</h2>
      <input></input>
      <button>검색</button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>문의번호</th>
            <th>아이디</th>
            <th>닉네임</th>
            <th>이름</th>
            <th>문의일</th>
            <th>제목</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {ticketList.map((ticket, i) => (
            <tr key={i}>
              <td>{ticket._id}</td>
              <td>{ticket.user.id}</td>
              <td>{ticket.user.nick}</td>
              <td>{ticket.user.name}</td>
              <td>{dateFormConvert(ticket.date)}</td>
              <td>{ticket.title}</td>
              <td>{ticket.status}</td>
              <td>
                <button
                  onClick={() => {
                    openModal();
                    setModalTicket(ticket);
                  }}
                >
                  답변/수정
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function TicketManagementModal({ ticket, closeModal }) {
  const [answer, setAnswer] = useState();

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>1:1 문의 답변/수정 - {ticket._id}</h2>
        <p>
          | 문의 ID : {ticket.user.id} | 닉네임 : {ticket.user.nick} | 이름 :
          {" " + ticket.user.name} | 상태 : {ticket.status} |
        </p>
        <p>제목 : {ticket.title}</p>
        <p>내용 : {ticket.q}</p>
        <div>
          <textarea
            placeholder="답변을 입력하세요."
            defaultValue={ticket.a}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="button-box">
          <button
            onClick={() => {
              closeModal();
            }}
          >
            닫기
          </button>
          <button
            onClick={() => {
              editTicket(ticket, answer);
              closeModal();
            }}
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderList() {
  const [orderList, setOrderList] = useState([]);
  const [searchId, setSearchId] = useState();
  const [search, setSearch] = useState();
  const getOrders = async () => {
    setOrderList(await getOrderList());
  };
  const editOrderAndShowPopup = async (id, input) => {
    await editOrder(id, input);
  };
  const changePosition = async (id, pos) => {
    await changeOrderPosition(id, pos);
  };
  useEffect(() => {
    setInterval(() => {
      getOrders();
    }, 2000);
  }, []);
  return (
    <>
      <h2>주문내역</h2>
      <input
        placeholder="ID로 검색"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      ></input>
      <button
        onClick={() => {
          setSearchId(search);
        }}
      >
        검색
      </button>
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
          {orderList.map((order, i) => {
            if (searchId && order.id != searchId) {
              return null;
            }
            return (
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
                    <>
                      <button
                        onClick={() => {
                          let userInput = prompt(
                            "수정할 거래금액을 입력해주세요.",
                            order.amount
                          );
                          editOrderAndShowPopup(order._id, userInput);
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => {
                          changePosition(order._id, order.type);
                        }}
                      >
                        포지션
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            );
          })}
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
    setInterval(getDW, 5000);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userModal, setUserModal] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [DWList, setDWList] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getUser = async () => {
    let data = await getUserList();
    data.map((e) => {
      if (!e.ip) {
        e.ip = [];
      }
    });

    setUserList(data);
  };

  const setData = async () => {
    setOrderList(await getOrderList());
    setDWList(await getDWList());
  };

  useEffect(() => {
    getUser();
    setData();
    setInterval(() => {
      getUser();
      setData();
    }, 1500);
  }, []);

  return (
    <>
      {isModalOpen ? (
        <UserManagementModal
          user={userList[userModal]}
          orderList={orderList}
          DWList={DWList}
          closeModal={closeModal}
        />
      ) : (
        ""
      )}
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
              <td>{user.status}</td>
              <td>
                <button
                  onClick={() => {
                    userStatusChagne(user._id, user.status);
                    getUser();
                  }}
                >
                  {user.status == "정상" ? "차단" : "승인"}
                </button>
                <button
                  onClick={() => {
                    setUserModal(i);
                    openModal();
                  }}
                >
                  상세
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function UserManagementModal({ user, orderList, DWList, closeModal }) {
  const [pw, setPW] = useState(user.pw);
  const [balance, setBalance] = useState(user.balance);
  const [bank, setBank] = useState(user.bank);
  const [account, setAccount] = useState(user.account);
  const [holder, setHolder] = useState(user.holder);
  const [ref, setRef] = useState(user.ref);
  const [messageTitle, setMessageTitle] = useState();
  const [messageContent, setMessageContent] = useState();

  const sendMessage = async (id, title, content) => {
    console.log(title);
    const msg = await postUserMessage(id, title, content);
    alert(msg);
  };

  const update = async (data) => {
    updateUserDetail(...data);
  };

  const edit = async (id, bal) => {
    const msg = await editBalance(id, bal);
    alert(msg);
  };
  const postRemote = async (id, remote) => {
    const msg = await editRemote(id, remote);
    alert(msg);
  };

  const editOrderAndShowPopup = async (id, input) => {
    await editOrder(id, input);
  };

  const changePosition = async (id, pos) => {
    await changeOrderPosition(id, pos);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>회원 상세 정보 - {user._id}</h2>
        <p>asd</p>
        <div className="user-detail-wrap">
          <table className="info-table">
            <tr>
              <th>아이디</th>
              <td>{user.id}</td>
            </tr>
            <tr>
              <th>비밀번호</th>
              <td>
                <input
                  defaultValue={user.pw}
                  onChange={(e) => {
                    setPW(e.target.value);
                  }}
                ></input>
              </td>
            </tr>
            <tr>
              <th>이름</th>
              <td>{user.name}</td>
            </tr>
            <tr>
              <th>닉네임</th>
              <td>{user.nick}</td>
            </tr>
            <tr>
              <th>잔액</th>
              <td>
                {user.balance}
                <button
                  onClick={() => {
                    let inputValue = prompt("+/-할 금액을 입력하세요.");
                    while (inputValue !== null && isNaN(inputValue)) {
                      inputValue = prompt(
                        "+/-할 금액을 입력하세요. 숫자만 입력 가능합니다."
                      );
                    }
                    edit(user._id, inputValue);
                  }}
                >
                  + / -
                </button>
              </td>
            </tr>
            <tr>
              <th>다음 거래 배율</th>
              <td>
                {user.remote + "X "}
                <button
                  onClick={() => {
                    let inputValue = prompt(
                      "다음 거래 배율을 입력하세요.",
                      user.remote
                    );
                    while (inputValue !== null && isNaN(inputValue)) {
                      inputValue = prompt(
                        "다음 거래 배율을 입력하세요. 숫자만 입력 가능합니다."
                      );
                    }
                    postRemote(user._id, inputValue);
                  }}
                >
                  set
                </button>
              </td>
            </tr>
            <tr>
              <th>은행</th>
              <td>
                <input
                  defaultValue={user.bank}
                  onChange={(e) => {
                    setBank(e.target.value);
                  }}
                ></input>
              </td>
            </tr>
            <tr>
              <th>계좌번호</th>
              <td>
                <input
                  defaultValue={user.account}
                  onChange={(e) => {
                    setAccount(e.target.value);
                  }}
                ></input>
              </td>
            </tr>
            <tr>
              <th>예금주</th>
              <td>
                <input
                  defaultValue={user.holder}
                  onChange={(e) => {
                    setHolder(e.target.value);
                  }}
                ></input>
              </td>
            </tr>
            <tr>
              <th>전화번호</th>
              <td>{user.phone}</td>
            </tr>
            <tr>
              <th>생년월일</th>
              <td>{user.birth}</td>
            </tr>
            <tr>
              <th>지점</th>
              <td>
                <input
                  defaultValue={user.ref}
                  onChange={(e) => {
                    setRef(e.target.value);
                  }}
                ></input>
              </td>
            </tr>
            <tr>
              <th>상태</th>
              <td>{user.status}</td>
            </tr>
          </table>
          <div className="scroll-wrap">
            <h3>접속 ip</h3>
            <table>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {user.ip.map((e, i) => {
                  return (
                    <tr>
                      <td>{dateFormConvert(e.date).slice(5)}</td>
                      <td>{e.ip}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="scroll-wrap">
            <h3>거래</h3>
            <table>
              <thead>
                <tr>
                  <th>종목</th>
                  <th>게임</th>
                  <th>회원픽</th>
                  <th>결과</th>
                  <th>거래금액</th>
                  <th>상태</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map((order, i) => {
                  if (order.orderer != user._id) {
                    return null;
                  }

                  return (
                    <tr key={i}>
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
                      <td>
                        {order.result == "pending" ? (
                          <div className="button-box">
                            <button
                              onClick={() => {
                                let userInput = prompt(
                                  "수정할 거래금액을 입력해주세요.",
                                  order.amount
                                );
                                editOrderAndShowPopup(order._id, userInput);
                              }}
                            >
                              금액
                            </button>
                            <button
                              onClick={() => {
                                changePosition(order._id, order.type);
                              }}
                            >
                              포지션
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <div className="scroll-wrap" style={{ height: "330px" }}>
              <h3>입출금</h3>
              <table>
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>유형</th>
                    <th>금액</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {DWList.map((order, i) => {
                    if (order.applicant != user._id) {
                      return null;
                    }

                    return (
                      <tr key={i}>
                        <td>{dateFormConvert(order.date)}</td>
                        <td>{order.type}</td>
                        <td>{order.amount}</td>
                        <td>{order.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div
              className="scroll-wrap"
              style={{ height: "330px", marginTop: "1rem" }}
            >
              <h3>메세지 보내기</h3>
              <input
                placeholder="제목"
                onChange={(e) => {
                  setMessageTitle(e.target.value);
                }}
              ></input>
              <textarea
                placeholder="내용"
                onChange={(e) => {
                  setMessageContent(e.target.value);
                }}
              ></textarea>
              <button
                onClick={() => {
                  sendMessage(user._id, messageTitle, messageContent);
                }}
              >
                전송
              </button>
            </div>
          </div>
        </div>

        <div className="button-box">
          <button
            onClick={() => {
              update([user._id, pw, balance, bank, account, holder, ref]);
              alert("회원 정보가 변경되었습니다.");
            }}
          >
            변경
          </button>
          <button
            onClick={() => {
              closeModal();
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
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
