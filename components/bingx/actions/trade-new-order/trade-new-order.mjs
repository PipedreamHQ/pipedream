import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade New Order",
  key: "bingx-trade-new-order",
  description: "Place a New Order. [See the documentation](https://bingx-api.github.io/docs/swap/trade-api.html#_1-place-a-new-order)",
  version: "0.1.3",
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
        "action",
      ],
    },
    takerProfitPrice: {
      label: "Taker Profit Price",
      description: "The take profit price",
      type: "string",
      optional: true,
    },
    stopLossPrice: {
      label: "Stop Loss Price",
      description: "The take loss price",
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
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/trade";

    const parameters = {
      "symbol": this.symbol,
      "side": this.side,
      "entrustPrice": this.bingx.convertToFloat(this.entrustPrice),
      "entrustVolume": this.bingx.convertToFloat(this.entrustVolume),
      "tradeType": this.tradeType,
      "action": this.action,
      "takerProfitPrice": this.bingx.convertToFloat(this.takerProfitPrice?.toString().replace(",", ".")),
      "stopLossPrice": this.bingx.convertToFloat(this.stopLossPrice?.toString().replace(",", ".")),
    };
    this.cleanObject(parameters);
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `New Future Order for ${this.symbol}`);
    return returnValue;
  },
};
