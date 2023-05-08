import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  ConvertCurrencyParams, GetHistoricalRatesParams, GetLatestRatesParams, HttpRequestParams,
} from "../common/types";
import { CURRENCIES } from "../common/constants";

export default defineApp({
  type: "app",
  app: "currencyscoop",
  propDefinitions: {
    currency: {
      type: "string",
      label: "Base Currency",
      description: "The base currency you would like to use for your rates.",
      options: CURRENCIES,
    },
    targetCurrencies: {
      type: "string[]",
      label: "Target Currencies",
      description: "A list of currencies you will like to see the rates for. [See all supported currencies here.](https://currencybeacon.com/supported-currencies)",
      options: CURRENCIES,
    },
    date: {
      type: "string",
      label: "Date",
      description: "The historical date you would like to access, in the `YYYY-MM-DD` format.",
    },
  },
  methods: {
    async _httpRequest<ResponseType extends object>({
      $ = this,
      params,
      ...args
    }: HttpRequestParams): Promise<ResponseType> {
      const { api_key } = this.$auth;
      return axios($, {
        baseURL: "https://api.currencybeacon.com/v1",
        params: {
          ...params,
          api_key,
        },
        ...args,
      });
    },
    async getLatestRates(args: GetLatestRatesParams) {
      return this._httpRequest({
        url: "/latest",
        ...args,
      });
    },
    async getHistoricalRates(args: GetHistoricalRatesParams) {
      return this._httpRequest({
        url: "/historical",
        ...args,
      });
    },
    async convertCurrency(args: ConvertCurrencyParams) {
      return this._httpRequest({
        url: "/convert",
        ...args,
      });
    },
  },
});
