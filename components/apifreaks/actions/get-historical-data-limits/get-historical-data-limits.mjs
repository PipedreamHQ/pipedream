import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-historical-data-limits",
  name: "Get Historical Data Availability Limits",
  description: "Returns the date range when historical data is available for each currency. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,

  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/currency/historical/data/limits",
    });
    $.export("$summary", "Successfully executed Get Historical Data Availability Limits");
    return response;
  },
};
