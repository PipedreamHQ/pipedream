import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade New Order",
  key: "bingx-trade-new-order",
  description: "Place a New Order. [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Trade%20order)",
  version: "0.1.6",
  ai: "optimized",
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
      label: "Take Profit",
      description: "JSON string for take profit. Nested `stopPrice` must be a JSON number; `price` must also be a JSON number and is required for `TAKE_PROFIT`. Example: `{\"type\":\"TAKE_PROFIT_MARKET\",\"stopPrice\":65000,\"workingType\":\"MARK_PRICE\"}`.",
      type: "string",
      optional: true,
    },
    stopLoss: {
      label: "Stop Loss",
      description: "JSON string for stop loss. Nested `stopPrice` must be a JSON number; `price` must also be a JSON number and is required for `STOP`. Example: `{\"type\":\"STOP_MARKET\",\"stopPrice\":60000,\"workingType\":\"MARK_PRICE\"}`.",
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
      "takeProfit": this.takerProfit,
      "stopLoss": this.stopLoss,
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
