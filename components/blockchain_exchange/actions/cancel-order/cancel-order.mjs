import app from "../../blockchain_exchange.app.mjs";

export default {
  key: "blockchain_exchange-cancel-order",
  name: "Cancel Order",
  description: "Cancel an existing open order. [See the docs](https://api.blockchain.com/v3/#/trading/deleteAllOrders).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
