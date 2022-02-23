// legacy_hash_id: a_nji8bM
import { axios } from "@pipedream/platform";
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-convert-currency",
  name: "Convert Currency via exchangerate.host",
  version: "0.1.1",
  type: "action",
  props: {
    helper_functions,
    fromCurrency: {
      type: "string",
    },
    toCurrency: {
      type: "string",
    },
    value: {
      type: "string",
    },
  },
  async run({ $ }) {
    const url = `https://api.exchangerate.host/latest?base=${this.fromCurrency}&symbols=${this.toCurrency}`;
    const conversionResult = (await axios($, url));
    const rate = conversionResult["rates"][this.toCurrency];
    return rate * this.value;
  },
};
