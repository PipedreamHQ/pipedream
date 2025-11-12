import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-trade-get-unfilled-orders",
  name: "Spot - Trade - Get Unfilled Orders",
  description: "Retrieve unfilled (open) orders for a user on Bitget. [See the documentation](https://www.bitget.com/api-doc/spot/trade/Get-Unfilled-Orders)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    symbol: {
      propDefinition: [
        app,
        "symbol",
      ],
    },
    startTime: {
      propDefinition: [
        app,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        app,
        "endTime",
      ],
    },
    idLessThan: {
      label: "ID Less Than",
      description: "Requests the content on the page before this ID (older data), the value input should be the orderId of the corresponding interface.",
      propDefinition: [
        app,
        "orderId",
      ],
    },
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    tpslType: {
      propDefinition: [
        app,
        "tpslType",
      ],
    },
    requestTime: {
      propDefinition: [
        app,
        "requestTime",
      ],
    },
    receiveWindow: {
      description: "Valid window period Unix millisecond timestamp",
      propDefinition: [
        app,
        "receiveWindow",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Default: `100`, maximum: `500`.",
      optional: true,
      min: 1,
      max: 500,
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      startTime,
      endTime,
      idLessThan,
      orderId,
      tpslType,
      requestTime,
      receiveWindow,
      limit,
    } = this;

    const response = await app.getSpotTradeUnfilledOrders({
      $,
      params: {
        symbol,
        startTime,
        endTime,
        idLessThan,
        orderId,
        tpslType,
        requestTime,
        receiveWindow,
        limit,
      },
    });

    $.export("$summary", "Successfully retrieved unfilled spot orders");
    return response;
  },
};
