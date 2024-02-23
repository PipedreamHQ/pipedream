import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "coinmarketcap",
  propDefinitions: {
    convert: {
      type: "string",
      label: "Convert",
      description: "Optionally calculate market quotes in up to 120 currencies at once by passing a comma-separated list of cryptocurrency or fiat currency symbols. Each additional convert option beyond the first requires an additional call credit. A list of supported fiat options can be found at https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Each conversion is returned in its own \"quote\" object.",
      optional: true,
    },
    convertId: {
      type: "string",
      label: "Convert ID",
      description: "Optionally calculate market quotes by CoinMarketCap ID instead of symbol. This option is identical to convert outside of ID format. Ex: **Convert ID = `1,2781`** would replace **Convert** = `BTC,USD` in your query. This parameter cannot be used when **Convert** is used.",
      optional: true,
    },
    aux: {
      type: "string[]",
      label: "Supplemental Fields",
      description: "Optionally specify supplemental data fields to return.",
      optional: true,
    },
  },
  methods: {
    _makeRequest({
      $, headers, ...args
    }) {
      return axios($, {
        ...args,
        baseURL: `https://${this.$auth.environment}-api.coinmarketcap.com`,
        headers: {
          ...headers,
          "X-CMC_PRO_API_KEY": `${this.$auth.api_key}`,
        },
      });
    },
  },
};
