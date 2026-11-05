import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-historical-commodity-prices",
  name: "Get Historical Commodity Prices",
  description: "Returns OHLC price data for the requested commodity symbols on a specific date. [See the documentation](https://apifreaks.com/docs).",
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
    date: {
      type: "string",
      label: "Date",
      description: "Date in `YYYY-MM-DD` format. Data available from 1990 onwards.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/commodity/rates/historical",
      params: {
        symbols: this.symbols,
        date: this.date,
      },
    });
    $.export("$summary", "Successfully executed Get Historical Commodity Prices");
    return response;
  },
};
