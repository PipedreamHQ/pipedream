import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market Get All Contracts",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bingx-market-get-all-contracts",
  description: "Contract Information [See the documentation](https://bingx-api.github.io/docs/#/swapV2/market-api.html#Contract%20Information).",
  props: {
    bingx,
  },
  type: "action",
  async run({ $ }) {
    const returnValue = await this.bingx.getAllMarketContracts({
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", "Contract Information for Trading Pairs BingX");
    }
    return returnValue;
  },
};
