import app from "../../coingecko.app.mjs";

export default {
  key: "coingecko-get-global-defi-market-overview",
  name: "Get Global DeFi Market Overview",
  description: "Get the current DeFi market data from the top 100 cryptocurrencies, including DeFi market cap, trading volume, and top coin dominance. [See the documentation](https://docs.coingecko.com/v3.0.1/reference/global-defi)",
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
    const response = await this.app.getGlobalDefiMarket({
      $,
    });
    $.export("$summary", "Successfully retrieved global DeFi market overview");
    return response;
  },
};
