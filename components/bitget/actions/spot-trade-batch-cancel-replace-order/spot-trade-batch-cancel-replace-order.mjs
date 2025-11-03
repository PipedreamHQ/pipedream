import { ConfigurationError } from "@pipedream/platform";
import app from "../../bitget.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "bitget-spot-trade-batch-cancel-replace-order",
  name: "Spot - Trade - Batch Cancel Replace Order",
  description: "Cancel existing orders and send new orders in batch. Maximum 50 orders per request. [See the documentation](https://bitgetlimited.github.io/apidoc/en/spot/#batch-cancel-existing-order-and-send-new-orders)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    orderList: {
      type: "string[]",
      label: "Order List",
      description: "Array of order objects to cancel and replace. Each order should be a JSON string containing the order details. [See the documentation](https://www.bitget.com/api-doc/spot/trade/Batch-Cancel-Replace-Order)",
    },
  },
  methods: {
    parseOrderList(orderList) {
      return orderList?.map((order) => {
        try {
          if (!order.symbol) {
            throw new Error("`symbol` is required for each order");
          }
          if (!order.price) {
            throw new Error("`price` is required for each order");
          }
          if (!order.size) {
            throw new Error("`size` is required for each order");
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
      orderList: rawOrderList,
    } = this;

    const orderList = this.parseOrderList(utils.parseArray(rawOrderList));

    if (!orderList || orderList.length === 0) {
      throw new ConfigurationError("At least one order is required");
    }

    if (orderList.length > 50) {
      throw new ConfigurationError("Maximum 50 orders allowed per request");
    }

    const response = await app.batchCancelReplaceSpotTradeOrders({
      $,
      data: {
        orderList,
      },
    });

    $.export("$summary", "Successfully batch requested to cancel and replace spot orders");
    return response;
  },
};
