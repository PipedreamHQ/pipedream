import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "finage",
  propDefinitions: {
    symbol: {
      type: "string",
      label: "symbol",
      description: "Description for symbol",
      async options() {
        const response = await this.getSymbols();
        const symbols = response.symbols;
        return symbols.map(({
          symbol, name,
        }) => ({
          value: symbol,
          label: name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.finage.co.uk";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          apikey: `${this.$auth.api_key}`,
          ...params,
        },
      });
    },
    async forexLastQuote({
      symbol,
      ...args
    }) {
      return this._makeRequest({
        path: `/last/forex/${symbol}`,
        ...args,
      });
    },
    async forexLastTrade({
      symbol,
      ...args
    }) {
      return this._makeRequest({
        path: `/last/trade/forex/${symbol}`,
        ...args,
      });
    },
    async forexPreviousClose({
      symbol,
      ...args
    }) {
      return this._makeRequest({
        path: `/agg/forex/prev-close/${symbol}`,
        ...args,
      });
    },
    async getSymbols(args = {}) {
      return this._makeRequest({
        path: "/symbol-list/forex",
        ...args,
      });
    },
  },
};
