import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-commodity-time-series",
  name: "Get Commodity Price Time Series",
  description: "Returns day-by-day OHLC data for the requested commodity symbols within a date range. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    symbols: {
      type: "string",
      label: "Symbols",
      description: "Comma-separated list of commodity symbols.",
      optional: false,
    },
    startDate: {
      type: "string",
      label: "Startdate",
      description: "Start date in `YYYY-MM-DD` format.",
      optional: false,
    },
    endDate: {
      type: "string",
      label: "Enddate",
      description: "End date in `YYYY-MM-DD` format. Maximum range is 365 days.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/commodity/time-series",
      params: {
        symbols: this.symbols,
        startDate: this.startDate,
        endDate: this.endDate,
      },
    });
    $.export("$summary", "Successfully executed Get Commodity Price Time Series");
    return response;
  },
};
