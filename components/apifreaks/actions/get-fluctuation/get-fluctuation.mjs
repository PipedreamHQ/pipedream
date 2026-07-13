import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-fluctuation",
  name: "Get Exchange Rate Fluctuations",
  description: "Returns exchange rate fluctuations between two dates for the requested symbols. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    startDate: {
      type: "string",
      label: "Startdate",
      description: "Start date in `YYYY-MM-DD` format.",
      optional: false,
    },
    endDate: {
      type: "string",
      label: "Enddate",
      description: "End date in `YYYY-MM-DD` format. Defaults to yesterday.",
      optional: true,
    },
    base: {
      type: "string",
      label: "Base",
      description: "Base currency code. Defaults to `USD`.",
      optional: true,
    },
    symbols: {
      type: "string",
      label: "Symbols",
      description: "Comma-separated currency codes. Omit to get all available rates.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/currency/fluctuation",
      params: {
        startDate: this.startDate,
        endDate: this.endDate,
        base: this.base,
        symbols: this.symbols,
      },
    });
    $.export("$summary", "Successfully executed Get Exchange Rate Fluctuations");
    return response;
  },
};
