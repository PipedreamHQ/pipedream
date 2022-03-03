// legacy_hash_id: a_wdijbV
import { axios } from "@pipedream/platform";

export default {
  key: "coinmarketcap-latest-quotes",
  name: "Latest Quotes",
  description: "Returns the latest market quote for 1 or more cryptocurrencies. Use the \"\"convert\"\" option to return market values in multiple fiat and cryptocurrency conversions in the same call. At least one \"\"id\"\" or \"\"slug\"\" or \"\"symbol\"\" is required for this request. https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyQuotesLatest",
  version: "0.1.1",
  type: "action",
  props: {
    coinmarketcap: {
      type: "app",
      app: "coinmarketcap",
    },
    id: {
      type: "string",
      description: "One or more comma-separated cryptocurrency CoinMarketCap IDs. Example: 1,2",
      optional: true,
      options: [
        "active",
        "inactive",
        "untracked",
      ],
    },
    slug: {
      type: "string",
      description: "Alternatively pass a comma-separated list of cryptocurrency slugs. Example: \"bitcoin,ethereum\"",
      optional: true,
    },
    symbol: {
      type: "string",
      description: "Alternatively pass one or more comma-separated cryptocurrency symbols. Example: \"BTC,ETH\".",
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
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://${this.coinmarketcap.$auth.environment}-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`,
      headers: {
        "X-CMC_PRO_API_KEY": `${this.coinmarketcap.$auth.api_key}`,
      },
      params: {
        id: this.id,
        slug: this.slug,
        symbol: this.symbol,
        convert: this.convert,
        convert_id: this.convert_id,
      },
    });
  },
};
