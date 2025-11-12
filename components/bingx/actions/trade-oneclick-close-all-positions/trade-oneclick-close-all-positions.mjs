import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Trade One Click Close All Positions",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "bingx-trade-oneclick-close-all-positions",
  description: "One-Click Close All Positions [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#One-Click%20Close%20All%20Positions).",
  props: {
    bingx,
  },
  type: "action",
  async run({ $ }) {
    const returnValue = await this.bingx.makeRequest({
      path: "/trade/closeAllPositions",
      method: "POST",
      $,
    });
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", "Oneclick close all positions");
    }
    return returnValue;
  },
};
