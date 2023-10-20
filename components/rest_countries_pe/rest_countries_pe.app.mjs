import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rest_countries_pe",
  propDefinitions: {
    language: {
      type: "string",
      label: "Language",
      description: "Search country by language",
      async options() {
        return this.getLanguages();
      },
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Search country by currency",
      async options() {
        return this.getCurrencies();
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://restcountries.com/v3.1";
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        ...args,
      };
      return axios($, config);
    },
    getAll(args = {}) {
      return this._makeRequest({
        path: "/all",
        ...args,
      });
    },
    searchByName(name, args = {}) {
      return this._makeRequest({
        path: `/name/${name}`,
        ...args,
      });
    },
    searchByLanguage(language, args = {}) {
      return this._makeRequest({
        path: `/lang/${language}`,
        ...args,
      });
    },
    searchByCurrency(currency, args = {}) {
      return this._makeRequest({
        path: `/currency/${currency}`,
        ...args,
      });
    },
    async getLanguages() {
      const countries = await this.getAll();
      const languages = [];
      for (const country of countries) {
        if (country?.languages) {
          languages.push(...Object.values(country.languages));
        }
      }
      return [
        ...new Set(languages),
      ];
    },
    async getCurrencies() {
      const countries = await this.getAll();
      const currencies = [];
      for (const country of countries) {
        if (country?.currencies) {
          const currencyValues = (Object.keys(country.currencies)).map((currencyKey) => ({
            label: country.currencies[currencyKey].name,
            value: currencyKey,
          }));
          currencies.push(...currencyValues);
        }
      }
      return [
        ...new Set(currencies),
      ];
    },
  },
};
