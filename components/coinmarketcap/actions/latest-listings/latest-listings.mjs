// legacy_hash_id: a_rJiLNE
import { axios } from "@pipedream/platform";

export default {
  key: "coinmarketcap-latest-listings",
  name: "Latest Listings",
  description: "Returns a paginated list of all active cryptocurrencies with latest market data. https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyListingsLatest",
  version: "0.1.1",
  type: "action",
  props: {
    coinmarketcap: {
      type: "app",
      app: "coinmarketcap",
    },
    start: {
      type: "integer",
      description: "Optionally offset the start (1-based index) of the paginated list of items to return.",
      optional: true,
    },
    limit: {
      type: "integer",
      description: "Optionally specify the number of results to return. Use this parameter and the \"start\" parameter to determine your own pagination size.",
      optional: true,
    },
    volume_24h_min: {
      type: "integer",
      description: "Optionally specify a threshold of minimum 24 hour USD volume to filter results by.",
      optional: true,
    },
    convert: {
      type: "string",
      description: "Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found at https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Each conversion is returned in its own \"quote\" object.",
      optional: true,
    },
    convert_id: {
      type: "string",
      description: "Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: convert_id=1,2781 would replace convert=BTC,USD in your query. This parameter cannot be used when convert is used.",
      optional: true,
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
    sort_dir: {
      type: "string",
      description: "The direction in which to order cryptocurrencies against the specified sort.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    cryptocurrency_type: {
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
      type: "string",
      description: "Optionally specify a comma-separated list of supplemental data fields to return. Pass num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported to include all auxiliary fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://${this.coinmarketcap.$auth.environment}-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`,
      headers: {
        "X-CMC_PRO_API_KEY": `${this.coinmarketcap.$auth.api_key}`,
      },
      params: {
        start: this.start,
        limit: this.limit,
        volume_24h_min: this.volume_24h_min,
        convert: this.convert,
        convert_id: this.convert_id,
        sort: this.sort,
        sort_dir: this.sort_dir,
        cryptocurrency_type: this.cryptocurrency_type,
        aux: this.aux,
      },
    });
  },
};
