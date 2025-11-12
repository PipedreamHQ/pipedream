import coinmarketcap from "../../coinmarketcap.app.mjs";

export default {
  key: "coinmarketcap-get-cryptocurrency-metadata",
  name: "Get Cryptocurrency Metadata",
  description:
    "Returns all static metadata available for one or more cryptocurrencies. [See the documentation](https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyInfo)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    coinmarketcap,
    ids: {
      type: "string[]",
      label: "Cryptocurrency IDs",
      description: "One or more cryptocurrency CoinMarketCap IDs. You can use the **Get ID Map** action to list cryptocurrency IDs.",
    },
    skipInvalid: {
      type: "boolean",
      label: "Skip Invalid",
      description: "When requesting records on multiple cryptocurrencies, an error is returned if any invalid cryptocurrencies are requested or a cryptocurrency does not have matching records in the requested timeframe. If set to `true`, invalid lookups will be skipped allowing valid cryptocurrencies to still be returned.",
      optional: true,
      default: false,
    },
    aux: {
      propDefinition: [
        coinmarketcap,
        "aux",
      ],
      options: [
        "urls",
        "logo",
        "description",
        "tags",
        "platform",
        "date_added",
        "notice",
        "status",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.coinmarketcap._makeRequest({
      $,
      url: "/v2/cryptocurrency/info",
      params: {
        id: this.ids.join(),
        skip_invalid: this.skipInvalid,
        aux: this.auw,
      },
    });
    $.export("$summary", "Successfully retrieved metadata");
    return response;
  },
};
