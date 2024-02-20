// legacy_hash_id: a_wdijbV
import { axios } from "@pipedream/platform";
import coinmarketcap from "../../coinmarketcap.app.mjs";

export default {
  key: "coinmarketcap-latest-quotes",
  name: "Get Latest Quotes",
  description: "Returns the latest market quote for 1 or more cryptocurrencies. Use the \"\"convert\"\" option to return market values in multiple fiat and cryptocurrency conversions in the same call. At least one \"\"id\"\" or \"\"slug\"\" or \"\"symbol\"\" is required for this request. [See the documentation](https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyQuotesLatest)",
  version: "0.1.2",
  type: "action",
  props: {
    coinmarketcap,
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
