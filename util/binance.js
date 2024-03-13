const Binance = require("node-binance-api");
const binance = new Binance().options({
  APIKEY: "YmWu5T2lbWm0rnvYhgQx2NfHVVYVVcfq3OLlrbZBjKwSJYNrcwkMdgy97aZRBJFk",
  useServerTime: true,
  test: true,
});

export { binance };
