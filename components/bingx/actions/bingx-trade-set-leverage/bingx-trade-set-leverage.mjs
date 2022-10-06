import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade SetLeverage",
  version: "0.0.1",
  key: "bingx-trade-set-leverage",
  description: "Switch Leverage [reference](https://bingx-api.github.io/docs/swap/trade-api.html#_10-switch-leverage).",
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
        "leverageSide",
      ],
    },
    leverage: {
      propDefinition: [
        bingx,
        "leverage",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/setLeverage";
    const parameters = {
      "symbol": this.symbol,
      "side": this.side,
      "leverage": this.leverage,
    };
    let returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Set Leverage ${this.leverage} for ${this.side} of ${this.symbol}`);
    return returnValue;
  },
};
