import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  ConvertCurrencyParams, ConvertCurrencyResponse, CurrencyScoopResponse, GetHistoricalRatesParams, GetLatestRatesParams, GetRatesResponse, HttpRequestParams,
} from "../common/types";
import { CURRENCIES } from "../common/constants";

export default defineApp({
  type: "app",
  app: "currencyscoop",
  propDefinitions: {
    currency: {
      type: "string",
      label: "Base Currency",
      description: "The base currency to use for your rates.",
      options: CURRENCIES,
    },
    targetCurrency: {
      type: "string",
      label: "Target Currency",
      description: "The currency you would like to see the rates for. [See all supported currencies here.](https://currencybeacon.com/supported-currencies)",
      options: CURRENCIES,
    },
    targetCurrencies: {
      type: "string[]",
      label: "Target Currencies",
      description: "A list of currencies to see the rates for. [See all supported currencies here.](https://currencybeacon.com/supported-currencies)",
      options: CURRENCIES,
    },
    date: {
      type: "string",
      label: "Date",
      description: "The historical date you would like to access, in the `YYYY-MM-DD` format.",
    },
  },
  methods: {
    async _httpRequest({
      $ = this,
      params,
      ...args
    }: HttpRequestParams): Promise<object> {
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
    async getLatestRates(args: GetLatestRatesParams): Promise<CurrencyScoopResponse<GetRatesResponse>> {
      return this._httpRequest({
        url: "/latest",
        ...args,
      });
    },
    async getHistoricalRates(args: GetHistoricalRatesParams): Promise<CurrencyScoopResponse<GetRatesResponse>> {
      return this._httpRequest({
        url: "/historical",
        ...args,
      });
    },
    async convertCurrency(args: ConvertCurrencyParams): Promise<CurrencyScoopResponse<ConvertCurrencyResponse>> {
      return this._httpRequest({
        url: "/convert",
        ...args,
      });
    },
  },
});
