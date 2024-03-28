import axios from "axios";

export default async function handler(req, res) {
  if (req.method == "GET") {
    let response = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol: "BTCUSDT",
        interval: "1d",
        limit: 1,
      },
    });
    res.status(200).json(response.data[0]);
  }
}
