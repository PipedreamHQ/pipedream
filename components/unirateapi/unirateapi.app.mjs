import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "unirateapi",
  propDefinitions: {
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "An ISO 4217 currency code (e.g. `USD`, `EUR`, `GBP`).",
      async options() {
        const { currencies = [] } = await this.listCurrencies();
        return currencies.map((value) => ({
          label: value,
          value,
        }));
      },
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "An ISO 3166-1 alpha-2 country code (e.g. `DE`, `FR`, `GB`). If omitted, VAT rates for all supported countries are returned.",
      optional: true,
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.unirateapi.com/api";
    },
    _getParams(params) {
      return {
        api_key: this.$auth.api_key,
        ...params,
      };
    },
    async _makeRequest({
      $ = this, path, params = {}, headers = {}, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        params: this._getParams(params),
        ...opts,
        headers: {
          Accept: "application/json",
          ...headers,
        },
      });
    },
    listCurrencies(args = {}) {
      return this._makeRequest({
        path: "currencies",
        ...args,
      });
    },
    getRates({
      from, to, ...args
    } = {}) {
      return this._makeRequest({
        path: "rates",
        params: {
          from,
          ...(to && {
            to,
          }),
        },
        ...args,
      });
    },
    convert({
      from, to, amount, ...args
    }) {
      return this._makeRequest({
        path: "convert",
        params: {
          from,
          to,
          amount,
        },
        ...args,
      });
    },
    getVatRates({
      country, ...args
    } = {}) {
      return this._makeRequest({
        path: "vat/rates",
        params: {
          ...(country && {
            country,
          }),
        },
        ...args,
      });
    },
  },
};
