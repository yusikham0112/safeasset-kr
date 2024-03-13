import { binance } from "@/util/binance";

export default async function handler(req, res) {
  if (req.method == "GET") {
    let price;
    price = await binance.prices("BTCUSDT");
    price = price.BTCUSDT;
    res.status(200).json(price);
  }
}
