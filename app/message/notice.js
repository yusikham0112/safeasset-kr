"use client";

import Link from "next/link";
import { getNotice } from "./action";
import { useEffect, useState } from "react";

export default function Notice() {
  const [noticeList, setNoticeList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNotice, setModalNotice] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    getList();
  };

  const getList = async () => {
    setNoticeList(await getNotice());
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="deposit-container">
      {isModalOpen ? (
        <NoticeModal closeModal={closeModal} notice={modalNotice} />
      ) : (
        ""
      )}
      <h3>Message</h3>
      <h1>메세지</h1>
      <div className="b-menu">
        <div className="active-menu">메세지</div>
      </div>
      <table className="ticket-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>제목</th>
          </tr>
        </thead>
        <tbody>
          {noticeList.length == 0 ? (
            <tr>
              <td></td>
              <td>게시물이 없습니다.</td>
            </tr>
          ) : (
            noticeList.map((notice, i) => {
              return (
                <tr
                  key={i}
                  notice
                  onClick={() => {
                    setModalNotice(notice);
                    openModal();
                  }}
                >
                  <td>{dateFormConvert(notice.date)}</td>
                  <td>{notice.title}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function NoticeModal({ closeModal, notice }) {
  return (
    <div className="modal">
      <div className="modal-content modal-content-notice">
        <h2>{notice.title}</h2>
        <p>{dateFormConvert(notice.date)}</p>

        <textarea value={notice.content} readonly></textarea>
        <button onClick={closeModal} style={{ width: "6rem" }}>
          Close
        </button>
      </div>
    </div>
  );
}

function dateFormConvert(date) {
  date = date.toString();
  return `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}`;
}

function Modal() {}
