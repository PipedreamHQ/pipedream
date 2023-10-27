import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get All Contracts",
  version: "0.0.4",
  key: "bingx-market-get-all-contracts",
  description: "Contract Information [See the documentation](https://bingx-api.github.io/docs/#/swapV2/market-api.html#Contract%20Information).",
  props: {
    bingx,
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/openApi/swap/v2/quote/contracts";
    const parameters = {};
    const returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", "Contract Information for Trading Pairs BingX");
    return returnValue;
  },
};
