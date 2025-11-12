import bybit from "../../bybit.app.mjs";

export default {
  name: "ByBit Generic Market Symbols",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bybit-generic-market-symbols",
  description: "Get symbol info.[reference](https://bybit-exchange.github.io/docs/futuresV2/inverse/#t-querysymbol)",
  props: {
    bybit,
  },
  type: "action",
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/v2/public/symbols";
    const returnValue = await this.bybit.makeRequest(API_METHOD, API_PATH, this);
    if (returnValue.ret_code) {
      throw new Error(returnValue.ret_msg);
    } else {
      $.export("$summary", "Get Symbols Information Successful");
    }
    return returnValue;
  },
};
