import app from "../../coingecko.app.mjs";

export default {
  key: "coingecko-list-markets",
  name: "List Markets",
  description: "Search for coins, exchanges, NFTs, and categories on CoinGecko. [See the documentation](https://docs.coingecko.com/v3.0.1/reference/search-data)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "The search query string (e.g. `bitcoin`, `eth`).",
    },
  },
  async run({ $ }) {
    const {
      app,
      query,
    } = this;
    const response = await app.search({
      $,
      params: {
        query,
      },
    });
    const coinsCount = response.coins?.length ?? 0;
    const exchangesCount = response.exchanges?.length ?? 0;
    const nftsCount = response.nfts?.length ?? 0;
    const total = coinsCount + exchangesCount + nftsCount;
    $.export("$summary", `Successfully retrieved ${total} results for "${query}"`);
    return response;
  },
};
