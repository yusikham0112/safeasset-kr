"use client";

import Link from "next/link";
import { getTicketList } from "./action";
import { useEffect, useState } from "react";

export default function ticket() {
  const [ticketList, setTicketList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTicket, setModalTicket] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    getList();
  };

  const getList = async () => {
    setTicketList(await getTicketList());
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="deposit-container">
      {isModalOpen ? (
        <TicketModal closeModal={closeModal} ticket={modalTicket} />
      ) : (
        ""
      )}
      <h3>Help Center</h3>
      <h1>1:1 문의</h1>
      <div className="b-menu">
        <div className="non-active-menu">
          <Link href="/notice">공지사항</Link>
        </div>
        <div className="active-menu">1:1 문의</div>
      </div>
      <table className="ticket-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>제목</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {ticketList.length == 0 ? (
            <tr>
              <td></td>
              <td>게시물이 없습니다.</td>
            </tr>
          ) : (
            ticketList.map((ticket, i) => {
              return (
                <tr
                  key={i}
                  onClick={() => {
                    setModalTicket(ticket);
                    openModal();
                  }}
                >
                  <td>{dateFormConvert(ticket.date)}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <a href="/sendticket">
        <button>문의하기</button>
      </a>
    </div>
  );
}

function TicketModal({ closeModal, ticket }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>{ticket.status}</p>
        <h2>{ticket.title}</h2>

        <p>{dateFormConvert(ticket.date)}</p>
        <p>{"내용 :"}</p>
        <textarea value={ticket.q} readonly></textarea>
        <p>{"답변 :"}</p>
        <textarea
          value={ticket.a ? ticket.a : "등록된 답변이 없습니다."}
          readonly
        ></textarea>
        <button onClick={closeModal} style={{ width: "6rem" }}>
          Close
        </button>
      </div>
    </div>
  );
}

function dateFormConvert(date) {
  date = date.toString();
  return `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(
    6,
    8
  )} ${date.slice(8, 10)}:${date.slice(10, 12)}`;
}

function Modal() {}
