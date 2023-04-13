import coinmarketcal from "../../coinmarketcal.app.mjs";

export default {
  key: "coinmarketcal-list-categories",
  name: "List Categories",
  version: "0.0.1",
  description: "Obtain a list of all available event categories in CoinMarketCal. [See the docs here](https://coinmarketcal.com/en/doc/redoc#/paths/~1categories/get)",
  type: "action",
  props: {
    coinmarketcal,
  },
  async run({ $ }) {
    const response = await this.coinmarketcal.listCategories({
      $,
    });

    $.export("$summary", `${response.body.length} categories were successfully fetched!`);
    return response;
  },
};
