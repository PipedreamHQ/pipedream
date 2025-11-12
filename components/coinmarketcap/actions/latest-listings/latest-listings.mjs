// legacy_hash_id: a_rJiLNE
import coinmarketcap from "../../coinmarketcap.app.mjs";

export default {
  key: "coinmarketcap-latest-listings",
  name: "Get Latest Listings",
  description:
    "Returns a paginated list of all active cryptocurrencies with latest market data. [See the documentation](https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyListingsLatest)",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    coinmarketcap,
    start: {
      type: "integer",
      description:
        "Optionally offset the start (1-based index) of the paginated list of items to return.",
      optional: true,
    },
    limit: {
      type: "integer",
      description:
        "Optionally specify the number of results to return. Use this parameter and the \"start\" parameter to determine your own pagination size.",
      optional: true,
    },
    volume24hMin: {
      type: "integer",
      description:
        "Optionally specify a threshold of minimum 24 hour USD volume to filter results by.",
      optional: true,
    },
    convert: {
      propDefinition: [
        coinmarketcap,
        "convert",
      ],
    },
    convertId: {
      propDefinition: [
        coinmarketcap,
        "convertId",
      ],
    },
    sort: {
      type: "string",
      description: "What field to sort the list of cryptocurrencies by.",
      optional: true,
      options: [
        "market_cap",
        "name",
        "symbol",
        "date_added",
        "market_cap_strict",
        "price",
        "circulating_supply",
        "total_supply",
        "max_supply",
        "num_market_pairs",
        "volume_24h",
        "percent_change_1h",
        "percent_change_24h",
        "percent_change_7d",
        "market_cap_by_total_supply_strict",
        "volume_7d",
        "volume_30d",
      ],
    },
    sortDir: {
      type: "string",
      description:
        "The direction in which to order cryptocurrencies against the specified sort.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    cryptocurrencyType: {
      type: "string",
      description: "The type of cryptocurrency to include.",
      optional: true,
      options: [
        "all",
        "coins",
        "tokens",
      ],
    },
    aux: {
      propDefinition: [
        coinmarketcap,
        "aux",
      ],
      options: [
        "num_market_pairs",
        "cmc_rank",
        "date_added",
        "tags",
        "platform",
        "max_supply",
        "circulating_supply",
        "total_supply",
        "market_cap_by_total_supply",
        "volume_24h_reported",
        "volume_7d",
        "volume_7d_reported",
        "volume_30d",
        "volume_30d_reported",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.coinmarketcap._makeRequest({
      $,
      url: "/v1/cryptocurrency/listings/latest",
      params: {
        start: this.start,
        limit: this.limit,
        volume_24h_min: this.volume24hMin,
        convert: this.convert,
        convert_id: this.convertId,
        sort: this.sort,
        sort_dir: this.sortDir,
        cryptocurrency_type: this.cryptocurrencyType,
        aux: this.aux?.join?.(),
      },
    });
    $.export("$summary", "Successfully retrieved listings");
    return response;
  },
};
