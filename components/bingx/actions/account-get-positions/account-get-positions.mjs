import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Account GetPositions",
  version: "0.0.3",
  key: "bingx-account-get-positions",
  description: "Perpetual Swap Positions [reference](https://bingx-api.github.io/docs/swap/account-api.html#_2-perpetual-swap-positions).",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/getPositions";
    const parameters = {
      "symbol": this.symbol,
    };
    let returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", `Positions retrieved for symbol \`${this.symbol}\``);
    return returnValue;
  },
};
