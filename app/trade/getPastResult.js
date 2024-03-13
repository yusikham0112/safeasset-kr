"use server";

import axios from "axios";

require("dotenv").config();

export async function getPastResult(symbol, interval) {
  let results = [{ price: 0 }];
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol: symbol,
        interval: interval,
        limit: 21,
      },
    });
    response.data.map((e, i, r) => {
      if (i != r.length - 1) {
        results = [
          {
            date: getDate(e[0]),
            price: e[4],
            result: e[4] - results[0].price > 0 ? "Long" : "Short",
          },
          ...results,
        ];
      }
    });
    return results;
  } catch (e) {}
}

function getDate(i) {
  let date;
  i ? (date = new Date(i)) : (date = new Date());
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
