import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade New Order",
  key: "bingx-trade-new-order",
  description: "Place a New Order. [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Trade%20order)",
  version: "0.1.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
    side: {
      propDefinition: [
        bingx,
        "side",
      ],
    },
    entrustPrice: {
      propDefinition: [
        bingx,
        "entrustPrice",
      ],
    },
    entrustVolume: {
      propDefinition: [
        bingx,
        "entrustVolume",
      ],
    },
    tradeType: {
      propDefinition: [
        bingx,
        "tradeType",
      ],
    },
    action: {
      propDefinition: [
        bingx,
        "leverageSide",
      ],
    },
    takerProfit: {
      label: "Taker Profit",
      description: "Support setting take profit while placing an order. Only supports type: TAKE_PROFIT_MARKET/TAKE_PROFIT",
      type: "string",
      optional: true,
    },
    stopLoss: {
      label: "Stop Loss",
      description: "Support setting stop loss while placing an order. Only supports type: STOP_MARKET/STOP",
      type: "string",
      optional: true,
    },
  },
  methods: {
    cleanObject(o) {
      for (var k in o || {}) {
        if (typeof o[k] === "undefined") {
          delete o[k];
        }
      }
    },
  },
  async run({ $ }) {
    const parameters = {
      "symbol": this.symbol,
      "side": this.side,
      "price": this.bingx.convertToFloat(this.entrustPrice),
      "quantity": this.bingx.convertToFloat(this.entrustVolume),
      "type": this.tradeType,
      "positionSide": this.action,
      "takerProfit": this.takerProfit,
      "stopLoss": this.stopLossPrice,
    };
    this.cleanObject(parameters);
    const returnValue = await this.bingx.createOrder({
      params: parameters,
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `New Future Order for ${this.symbol}`);
    }
    return returnValue;
  },
};
