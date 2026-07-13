import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-time-series",
  name: "Get Time Series of Exchange Rates",
  description: "Returns day-by-day historical exchange rates for a custom date range. [See the documentation](https://apifreaks.com/docs).",
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
      path: "/v1.0/currency/time-series",
      params: {
        startDate: this.startDate,
        endDate: this.endDate,
        base: this.base,
        symbols: this.symbols,
      },
    });
    $.export("$summary", "Successfully executed Get Time Series of Exchange Rates");
    return response;
  },
};
