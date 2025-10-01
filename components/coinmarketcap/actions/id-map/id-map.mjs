// legacy_hash_id: a_LgijYE
import coinmarketcap from "../../coinmarketcap.app.mjs";

export default {
  key: "coinmarketcap-id-map",
  name: "Get ID Map (V1)",
  description: "Returns a mapping of all cryptocurrencies to unique CoinMarketCap ids. [See the documentation](https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyMap)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    coinmarketcap,
    listingStatus: {
      type: "string",
      description: "Only active cryptocurrencies are returned by default. Pass inactive to get a list of cryptocurrencies that are no longer active. Pass untracked to get a list of cryptocurrencies that are listed but do not yet meet methodology requirements to have tracked markets available. You may pass one or more comma-separated values.",
      optional: true,
      options: [
        "active",
        "inactive",
        "untracked",
      ],
    },
    start: {
      type: "integer",
      description: "Optionally offset the start (1-based index) of the paginated list of items to return.",
      optional: true,
    },
    limit: {
      type: "string",
      description: "Optionally specify the number of results to return. Use this parameter and the \"start\" parameter to determine your own pagination size.",
      optional: true,
    },
    sort: {
      type: "string",
      description: "What field to sort the list of cryptocurrencies by.",
      optional: true,
      options: [
        "cmc_rank",
        "id",
      ],
    },
    symbol: {
      type: "string",
      description: "Optionally pass a comma-separated list of cryptocurrency symbols to return CoinMarketCap IDs for. If this option is passed, other options will be ignored.",
      optional: true,
    },
    aux: {
      propDefinition: [
        coinmarketcap,
        "aux",
      ],
      options: [
        "platform",
        "first_historical_data",
        "last_historical_data",
        "is_active",
        "status",
      ],
    },
  },
  async run({ $ }) {
    const limit = this.limit ?? 100;

    const response = await this.coinmarketcap._makeRequest({
      $,
      url: "/v1/cryptocurrency/map",
      params: {
        listing_status: this.listingStatus,
        start: this.start,
        limit,
        sort: this.sort,
        symbol: this.symbol,
        aux: this.aux?.join?.(),
      },
    });
    $.export("$summary", "Successfully retrieved ID map");
    return response;
  },
};
