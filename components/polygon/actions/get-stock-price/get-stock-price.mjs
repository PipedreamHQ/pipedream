import polygon from "../../polygon.app.mjs";

export default {
  key: "polygon-get-stock-price",
  name: "Get Stock Price",
  description: "Get the open, close and afterhours prices of a stock symbol on a certain date. [See the documentation](https://polygon.io/docs/stocks/get_v1_open-close__stocksticker___date)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    polygon,
    stockTicker: {
      propDefinition: [
        polygon,
        "stockTicker",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the requested open/close in the format YYYY-MM-DD.",
    },
    adjusted: {
      propDefinition: [
        polygon,
        "adjusted",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {

      const response = await this.polygon.getCurrentPrice({
        $,
        date: this.date,
        stockTicker: this.stockTicker,
        params: {
          adjusted: this.adjusted,
        },
      });

      $.export("$summary", `Successfully fetched the price of ${this.stockTicker}`);
      return response;
    } catch ({ response }) {
      if (response.status === 404) {
        $.export("$summary", `No data found for ${this.stockTicker}`);
        return {};
      }
    }
  },
};
