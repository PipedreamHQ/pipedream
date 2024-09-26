import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "open_exchange_rates",
  propDefinitions: {
    currencyId: {
      type: "string",
      label: "Currency Id",
      description: "A list of currency symbols available.",
      async options() {
        const data = await this.listCurrencies();

        return Object.entries(data).map(([
          value,
          label,
        ]) => ({
          label: `(${value}) ${label}`,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://openexchangerates.org/api";
    },
    _getParams(params) {
      return {
        "app_id": this.$auth.app_id,
        ...params,
      };
    },
    async _makeRequest({
      $ = this, path, params = {}, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        params: this._getParams(params),
        ...opts,
      };

      return axios($, config);
    },
    convertCurrency({
      from,
      to,
      value,
      ...args
    }) {
      return this._makeRequest({
        path: `convert/${value}/${from}/${to}`,
        ...args,
      });
    },
    getLatestCurrency(args = {}) {
      return this._makeRequest({
        path: "latest.json",
        ...args,
      });
    },
    listCurrencies() {
      return this._makeRequest({
        path: "currencies.json",
      });
    },
  },
};
