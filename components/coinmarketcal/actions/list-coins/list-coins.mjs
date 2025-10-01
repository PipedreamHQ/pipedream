import coinmarketcal from "../../coinmarketcal.app.mjs";

export default {
  key: "coinmarketcal-list-coins",
  name: "List Coins",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Obtain a list of all available coins in CoinMarketCal. [See the docs here](https://coinmarketcal.com/en/doc/redoc#/paths/~1categories/get)",
  type: "action",
  props: {
    coinmarketcal,
  },
  async run({ $ }) {
    const response = await this.coinmarketcal.listCoins({
      $,
    });

    const length = response.body.length;

    $.export("$summary", `${length} coin${length === 1
      ? " was"
      : "s were"} successfully fetched!`);
    return response;
  },
};
