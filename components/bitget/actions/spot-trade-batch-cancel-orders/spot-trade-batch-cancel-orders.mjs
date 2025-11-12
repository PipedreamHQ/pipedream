import { ConfigurationError } from "@pipedream/platform";
import app from "../../bitget.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "bitget-spot-trade-batch-cancel-orders",
  name: "Spot - Trade - Batch Cancel Orders",
  description: "Cancel multiple spot orders in batch. Maximum 50 orders per request. [See the documentation](https://www.bitget.com/api-doc/spot/trade/Batch-Cancel-Orders)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    symbol: {
      description: "Trading pair name, e.g. BTCUSDT.",
      propDefinition: [
        app,
        "symbol",
      ],
    },
    batchMode: {
      propDefinition: [
        app,
        "batchMode",
      ],
    },
    orderList: {
      type: "string[]",
      label: "Order List",
      description: "Array of order objects to cancel. Each order should be a JSON string containing the order details. Maximum 50 orders per request. [See the documentation](https://www.bitget.com/api-doc/spot/trade/Batch-Cancel-Orders)",
    },
  },
  methods: {
    parseOrderList(orderList) {
      return orderList?.map((order) => {
        try {
          if (this.batchMode === "multiple" && !order.symbol) {
            throw new Error("`symbol` is required for each order in multiple mode");
          }
          if (!order.orderId && !order.clientOid) {
            throw new Error("Either `orderId` or `clientOid` is required for each order");
          }

          return order;
        } catch (error) {
          throw new ConfigurationError(`Invalid order JSON: ${error.message}`);
        }
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      batchMode,
      orderList: rawOrderList,
    } = this;

    const orderList = this.parseOrderList(utils.parseArray(rawOrderList));

    if (!orderList || orderList.length === 0) {
      throw new ConfigurationError("At least one order is required");
    }

    if (orderList.length > 50) {
      throw new ConfigurationError("Maximum 50 orders allowed per request");
    }

    const response = await app.batchCancelSpotTradeOrders({
      $,
      data: {
        symbol,
        batchMode,
        orderList,
      },
    });

    $.export("$summary", "Successfully batch requested to cancel spot orders");
    return response;
  },
};
