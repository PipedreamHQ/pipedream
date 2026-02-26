import app from "../../coingecko.app.mjs";

export default {
  key: "coingecko-list-trending-coins",
  name: "List Trending Coins",
  description: "List the top-7 trending coins on CoinGecko based on search volume in the last 24 hours. [See the documentation](https://docs.coingecko.com/v3.0.1/reference/trending-search)",
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
    const response = await this.app.getTrending({
      $,
    });
    const coins = response.coins ?? [];
    $.export("$summary", `Successfully retrieved ${coins.length} trending coins`);
    return coins;
  },
};
