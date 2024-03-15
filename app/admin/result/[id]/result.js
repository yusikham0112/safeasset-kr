"use client";

import { useEffect, useState } from "react";
import { getRemoteData, getUserInfo, postRemoteData } from "./action";

export default function Result(props) {
  const [resultList, setResultList] = useState([
    { date: 0 },
    { date: 0 },
    { date: 0 },
    { date: 0 },
    { date: 0 },
    { date: 0 },
    { date: 0 },
    { date: 0 },
    { date: 0 },
    { date: 0 },
  ]);
  const [sec, setSec] = useState(0);

  const [userInfo, setUserInfo] = useState({ id: "", name: "" });
  let symbol = "BTCUSDT";
  let interval = "1";
  const params = new URLSearchParams(window.location.search);

  if (params.get("symbol")) {
    symbol = params.get("symbol");
  }
  if (params.get("interval")) {
    interval = params.get("interval");
  }

  const getUI = async () => {
    setUserInfo(await getUserInfo(props.id));
  };

  const setList = async () => {
    console.log("run");
    let tempList = [];
    for (let i = 0; i < 10; i++) {
      let temp = {
        round: Math.trunc(
          (+getDate(false, i, +interval).toString().slice(8, 10) * 60 +
            +getDate(false, i, +interval).toString().slice(10)) /
            +interval
        ),
        date: getDate(false, i, +interval),
        result: "BINANCE",
        sec: getSec(false, i, +interval).toString() + "초",
      };
      let data = await getRemoteData(
        props.id,
        symbol,
        interval + "m",
        temp.date
      );
      if (data) {
        temp.result = data;
      }
      tempList.push(temp);
    }

    setResultList(tempList);
    console.log(tempList);
  };

  const postRemote = async (date, price) => {
    const res = await postRemoteData(
      props.id,
      symbol,
      interval + "m",
      date,
      price
    );
  };

  useEffect(() => {
    getUI();
    setInterval(async () => {
      setList();
    }, 1000);
    setInterval(async () => {
      setSec(60 - new Date().getSeconds());
    }, 1000);
  }, []);
  props.id;
  return (
    <>
      <h2>결과관리 - {userInfo.id + " - " + userInfo.name}</h2>
      <div>
        <button className={symbol == "BTCUSDT" ? "active-button" : ""}>
          BTC
        </button>
      </div>
      <div>
        <a href={`/admin/result/${props.id}?symbol=${symbol}&interval=1`}>
          <button className={interval == "1" ? "active-button" : ""}>1M</button>
        </a>
        <a href={`/admin/result/${props.id}?symbol=${symbol}&interval=2`}>
          <button className={interval == "2" ? "active-button" : ""}>2M</button>
        </a>
        <a href={`/admin/result/${props.id}?symbol=${symbol}&interval=3`}>
          <button className={interval == "3" ? "active-button" : ""}>3M</button>
        </a>
        <a href={`/admin/result/${props.id}?symbol=${symbol}&interval=5`}>
          <button className={interval == "5" ? "active-button" : ""}>5M</button>
        </a>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>회차</th>
            <th>거래시간</th>
            <th>통화쌍</th>
            <th>인터벌</th>
            <th>결과</th>
            <th>남은시간</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resultList.map((result, i) => {
            return (
              <tr key={i}>
                <td>{result.round}</td>
                <td>{result.date}</td>
                <td>{symbol}</td>
                <td>{interval + "M"}</td>
                <td>{result.result}</td>
                <td>
                  {(+result.date.toString().slice(10, 12) -
                    new Date().getMinutes()) *
                    60 +
                    sec +
                    "초"}
                </td>
                <td>
                  <button
                    onClick={() => {
                      let userInput;
                      let number;
                      do {
                        userInput = prompt(
                          "종가를 입력해 주세요. 취소는 0을 입력해주세요.",
                          ""
                        );
                        number = parseFloat(userInput);
                      } while (isNaN(number) || userInput.trim() === "");
                      if (number) {
                        postRemote(result.date, number);
                      }
                    }}
                  >
                    결과수정
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function getSec(i, p, interv) {
  let date;
  i ? (date = new Date(i)) : (date = new Date());
  if (date.getMinutes() % interv == 0) {
    date.setMinutes(date.getMinutes() + p * interv + 1);
  } else {
    date.setMinutes(
      Math.floor((date.getMinutes() + p * interv) / interv + 1) * interv + 1
    );
  }
  date.setSeconds(0);

  return (date - new Date()) / 1000;
}

function getDate(i, p, interv) {
  let date;
  i ? (date = new Date(i)) : (date = new Date());
  if (date.getMinutes() % interv == 0) {
    date.setMinutes(date.getMinutes() + p * interv);
  } else {
    date.setMinutes(
      Math.floor((date.getMinutes() + p * interv) / interv + 1) * interv
    );
  }
  const y = date.getFullYear().toString();
  let m = date.getMonth() + 1;
  m = m > 9 ? m.toString() : "0" + m.toString();
  let d = date.getDate();
  d = d > 9 ? d.toString() : "0" + d.toString();
  let h = date.getHours();
  h = h > 9 ? h.toString() : "0" + h.toString();
  let mm = date.getMinutes();
  mm = mm > 9 ? mm.toString() : "0" + mm.toString();
  return Number(y + m + d + h + mm);
}
