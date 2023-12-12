// legacy_hash_id: a_LgijYE
import { axios } from "@pipedream/platform";

export default {
  key: "coinmarketcap-id-map",
  name: "CoinMarketCap ID Map",
  description: "Returns a mapping of all cryptocurrencies to unique CoinMarketCap ids. https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyMap",
  version: "0.1.1",
  type: "action",
  props: {
    coinmarketcap: {
      type: "app",
      app: "coinmarketcap",
    },
    listing_status: {
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
      type: "string",
      description: "Optionally specify a comma-separated list of supplemental data fields to return. Pass platform,first_historical_data,last_historical_data,is_active,status to include all auxiliary fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    const limit = (typeof this.limit === "undefined")
      ? 100
      : this.limit;

    return await axios($, {
      url: `https://${this.coinmarketcap.$auth.environment}-api.coinmarketcap.com/v1/cryptocurrency/map`,
      headers: {
        "X-CMC_PRO_API_KEY": `${this.coinmarketcap.$auth.api_key}`,
      },
      params: {
        listing_status: this.listing_status,
        start: this.start,
        limit,
        sort: this.sort,
        symbol: this.symbol,
        aux: this.aux,
      },
    });
  },
};
