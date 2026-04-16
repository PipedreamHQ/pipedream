import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "coingecko",
  propDefinitions: {
    coinId: {
      type: "string",
      label: "Coin ID",
      description: "The coin ID (e.g. `bitcoin`, `ethereum`). Use the **List Coins** action to find the ID of the coin you want to use.",
    },
    vsCurrency: {
      type: "string",
      label: "vs Currency",
      description: "The target currency to convert to (e.g. `usd`, `eur`, `btc`). [See supported currencies](https://docs.coingecko.com/v3.0.1/reference/simple-supported-currencies)",
      async options() {
        const currencies = await this.getSupportedCurrencies();
        return currencies.map((currency) => ({
          label: currency.toUpperCase(),
          value: currency,
        }));
      },
    },
    exchangeId: {
      type: "string",
      label: "Exchange ID",
      description: "The exchange identifier (e.g. `binance`, `gdax`). [See exchanges list](https://docs.coingecko.com/v3.0.1/reference/exchanges-list)",
      async options() {
        const exchanges = await this.listExchanges();
        return exchanges.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
  },
  methods: {
    _isProduction() {
      return this.$auth.environment === "production";
    },
    getUrl(path) {
      const subdomain = this._isProduction()
        ? "pro-api"
        : "api";
      return `https://${subdomain}.coingecko.com/api/v3${path}`;
    },
    _apiKeyHeader() {
      return this._isProduction()
        ? "x-cg-pro-api-key"
        : "x-cg-demo-api-key";
    },
    getHeaders(headers) {
      return {
        [this._apiKeyHeader()]: this.$auth.api_key,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        ...opts,
      });
    },
    getGlobalMarket(opts = {}) {
      return this._makeRequest({
        path: "/global",
        ...opts,
      });
    },
    getExchangeRates(opts = {}) {
      return this._makeRequest({
        path: "/exchange_rates",
        ...opts,
      });
    },
    getGlobalDefiMarket(opts = {}) {
      return this._makeRequest({
        path: "/global/decentralized_finance_defi",
        ...opts,
      });
    },
    search(opts = {}) {
      return this._makeRequest({
        path: "/search",
        ...opts,
      });
    },
    listCoins(opts = {}) {
      return this._makeRequest({
        path: "/coins/list",
        ...opts,
      });
    },
    getCoinTickers({
      coinId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/coins/${coinId}/tickers`,
        ...opts,
      });
    },
    getTrending(opts = {}) {
      return this._makeRequest({
        path: "/search/trending",
        ...opts,
      });
    },
    listExchanges(opts = {}) {
      return this._makeRequest({
        path: "/exchanges/list",
        ...opts,
      });
    },
    getSupportedCurrencies(opts = {}) {
      return this._makeRequest({
        path: "/simple/supported_vs_currencies",
        ...opts,
      });
    },
    getCoinPrice(opts = {}) {
      return this._makeRequest({
        path: "/simple/price",
        ...opts,
      });
    },
    getCoinHistory({
      coinId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/coins/${coinId}/history`,
        ...opts,
      });
    },
    getCoin({
      coinId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/coins/${coinId}`,
        ...opts,
      });
    },
  },
};
