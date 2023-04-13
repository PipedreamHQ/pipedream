import coinmarketcal from "../../coinmarketcal.app.mjs";

export default {
  key: "coinmarketcal-list-coins",
  name: "List Coins",
  version: "0.0.1",
  description: "Obtain a list of all available coins in CoinMarketCal. [See the docs here](https://coinmarketcal.com/en/doc/redoc#/paths/~1categories/get)",
  type: "action",
  props: {
    coinmarketcal,
  },
  async run({ $ }) {
    const response = await this.coinmarketcal.listCoins({
      $,
    });

    $.export("$summary", `${response.body.length} coins were successfully fetched!`);
    return response;
  },
};
