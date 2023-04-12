import app from "../../blockchain_exchange.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "blockchain_exchange-cancel-order",
  name: "Cancel Order",
  description: "Cancel an existing open order. [See the docs](https://api.blockchain.com/v3/#/trading/deleteAllOrders).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The unique identifier of the order.",
    },
  },
  methods: {
    async cancelOrder(args = {}) {
      const response = await this.app.sendMessage({
        action: constants.TRADING_ACTION.CANCEL_ORDER_REQUEST,
        channel: constants.CHANNEL.TRADING,
        ...args,
      });

      if (utils.isRejected(response)) {
        throw new Error(JSON.stringify(response));
      }

      return response;
    },
  },
  async run({ $: step }) {
    const response = await this.cancelOrder({
      orderId: this.orderId,
    });

    step.export("$summary", "Successfully cancelled order");

    return response;
  },
};
