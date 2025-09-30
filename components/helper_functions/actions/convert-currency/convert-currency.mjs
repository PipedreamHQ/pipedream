import { axios } from "@pipedream/platform";
import helperFunctions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-convert-currency",
  name: "Convert Currency",
  description: "Convert an amount between currencies. [See the documentation](https://www.frankfurter.app/docs/)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helperFunctions,
    fromCurrency: {
      type: "string",
      label: "From Currency",
      description: "The currency to convert from",
      async options() {
        return this.getCurrencyOptions();
      },
    },
    toCurrency: {
      type: "string",
      label: "To Currency",
      description: "The currency to convert to",
      async options() {
        return this.getCurrencyOptions();
      },
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to convert",
    },
  },
  methods: {
    async getCurrencyOptions() {
      const currencies = await this.getCurrencies();
      const options = [];
      for (const [
        key,
        value,
      ] of Object.entries(currencies)) {
        options.push({
          value: key,
          label: value,
        });
      }
      return options;
    },
    getCurrencies($ = this) {
      return axios($, {
        url: "https://api.frankfurter.app/currencies",
      });
    },
    convertCurrency($ = this) {
      return axios($, {
        url: "https://api.frankfurter.app/latest",
        params: {
          from: this.fromCurrency,
          to: this.toCurrency,
          amount: this.value,
        },
      });
    },
  },
  async run({ $ }) {
    const response = await this.convertCurrency($);
    $.export("$summary", `${this.value} ${this.fromCurrency} = ${response.rates[this.toCurrency]} ${this.toCurrency}`);
    return response;
  },
};
