import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-commodity-fluctuation",
  name: "Get Commodity Price Fluctuations",
  description: "Returns price fluctuation metrics (start, end, change, percent change) for the requested commodity symbols over a date range. [See the documentation](https://apifreaks.com/docs).",
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
      description: "End date in `YYYY-MM-DD` format.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/commodity/fluctuation",
      params: {
        symbols: this.symbols,
        startDate: this.startDate,
        endDate: this.endDate,
      },
    });
    $.export("$summary", "Successfully executed Get Commodity Price Fluctuations");
    return response;
  },
};
