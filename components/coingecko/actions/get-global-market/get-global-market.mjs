import app from "../../coingecko.app.mjs";

export default {
  key: "coingecko-get-global-market",
  name: "Get Global Market",
  description: "Get global cryptocurrency market data including total market cap, total volume, market cap percentage, and more. [See the documentation](https://docs.coingecko.com/v3.0.1/reference/crypto-global)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getGlobalMarket({
      $,
    });
    $.export("$summary", "Successfully retrieved global market data");
    return response;
  },
};
