import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-historical-exchange-rates",
  name: "Get Historical Exchange Rates",
  description: "Returns exchange rates for a specific historical date. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    base: {
      type: "string",
      label: "Base",
      description: "Base currency code. Defaults to `USD`. Supports fiat, crypto, and metals.",
      optional: true,
    },
    symbols: {
      type: "string",
      label: "Symbols",
      description: "Comma-separated currency codes. Omit to get all available rates.",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Historical date in `YYYY-MM-DD` format.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/currency/rates/historical",
      params: {
        base: this.base,
        symbols: this.symbols,
        date: this.date,
      },
    });
    $.export("$summary", "Successfully executed Get Historical Exchange Rates");
    return response;
  },
};
