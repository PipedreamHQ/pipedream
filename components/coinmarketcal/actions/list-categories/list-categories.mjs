import coinmarketcal from "../../coinmarketcal.app.mjs";

export default {
  key: "coinmarketcal-list-categories",
  name: "List Categories",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Obtain a list of all available event categories in CoinMarketCal. [See the docs here](https://coinmarketcal.com/en/doc/redoc#/paths/~1categories/get)",
  type: "action",
  props: {
    coinmarketcal,
  },
  async run({ $ }) {
    const response = await this.coinmarketcal.listCategories({
      $,
    });

    const length = response.body.length;

    $.export("$summary", `${length} categor${length === 1
      ? "y was"
      : "ies were"} successfully fetched!`);
    return response;
  },
};
