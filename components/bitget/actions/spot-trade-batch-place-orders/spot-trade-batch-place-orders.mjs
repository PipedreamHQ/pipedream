import { ConfigurationError } from "@pipedream/platform";
import app from "../../bitget.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "bitget-spot-trade-batch-place-orders",
  name: "Spot - Trade - Batch Place Orders",
  description: "Place multiple spot orders in batch. Maximum 50 orders per request. [See the documentation](https://www.bitget.com/api-doc/spot/trade/Batch-Place-Orders)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
      description: "Array of order objects to place. Each order should be a JSON string containing the order details. Maximum 50 orders per request. [See the documentation](https://www.bitget.com/api-doc/spot/trade/Batch-Place-Orders)",
    },
  },
  methods: {
    parseOrderList(orderList) {
      return orderList?.map((order) => {
        try {
          if (this.batchMode === "multiple" && !order.symbol) {
            throw new Error("`symbol` is required for each order in multiple mode");
          }
          if (!order.side) {
            throw new Error("`side` is required for each order");
          }
          if (!order.orderType) {
            throw new Error("`orderType` is required for each order");
          }
          if (!order.force && order.orderType !== "market") {
            throw new Error("`force` is required for each order when orderType is not market");
          }
          if (!order.size) {
            throw new Error("`size` is required for each order");
          }

          if (order.orderType === "limit" && !order.price) {
            throw new Error("`price` is required for limit orders");
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

    const response = await app.batchPlaceSpotTradeOrders({
      $,
      data: {
        symbol,
        batchMode,
        orderList,
      },
    });

    $.export("$summary", "Successfully batch requested to place spot orders");
    return response;
  },
};
