import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-crypto-currencies",
  name: "Get Crypto Currencies",
  description: "Get crypto currencies. [See the documentation](https://docs.mboum.com/#crypto-GETapi-v1-crypto-coins)",
  version: "0.0.1",
  type: "action",
  props: {
    mboum,
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to fetch",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getCryptoCurrencies({
      $,
      params: {
        page: this.page,
      },
    });

    $.export("$summary", "Successfully fetched crypto currencies");

    return response.data;
  },
};
