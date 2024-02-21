import coinmarketcap from "../../coinmarketcap.app.mjs";

export default {
  key: "coinmarketcap-get-cryptocurrency-metadata",
  name: "Get Cryptocurrency Metadata",
  description:
    "Returns all static metadata available for one or more cryptocurrencies. [See the documentation](https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyInfo)",
  version: "0.0.1",
  type: "action",
  props: {
    coinmarketcap,
  },
  async run({ $ }) {
    const response = await this.coinmarketcap._makeRequest({
      $,
      url: "/v2/cryptocurrency/info",
    });
    $.export("$summary", "Successfully retrieved metadata");
    return response;
  },
};
