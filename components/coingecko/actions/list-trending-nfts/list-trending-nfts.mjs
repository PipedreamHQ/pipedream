import app from "../../coingecko.app.mjs";

export default {
  key: "coingecko-list-trending-nfts",
  name: "List Trending NFTs",
  description: "List the top-7 trending NFTs on CoinGecko based on the highest trading volume in the last 24 hours. [See the documentation](https://docs.coingecko.com/v3.0.1/reference/trending-search)",
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
    const nfts = response.nfts ?? [];
    $.export("$summary", `Successfully retrieved ${nfts.length} trending NFTs`);
    return nfts;
  },
};
