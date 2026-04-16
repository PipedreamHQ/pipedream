import app from "../../coingecko.app.mjs";

export default {
  key: "coingecko-list-coins",
  name: "List Coins",
  description: "List all supported coins with their ID, name, and symbol on CoinGecko. [See the documentation](https://docs.coingecko.com/v3.0.1/reference/coins-list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    includePlatform: {
      type: "boolean",
      label: "Include Platform",
      description: "Include platform contract addresses (e.g. Ethereum, Solana) for each coin.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { includePlatform } = this;
    const response = await this.app.listCoins({
      $,
      params: {
        include_platform: includePlatform,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.length} coins`);
    return response;
  },
};
