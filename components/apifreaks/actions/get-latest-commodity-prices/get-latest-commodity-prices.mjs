import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-latest-commodity-prices",
  name: "Get Latest Commodity Prices",
  description: "Returns the current live price for the requested commodity symbols. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    symbols: {
      type: "string",
      label: "Symbols",
      description: "Comma-separated list of commodity symbols (e.g., `XAU`, `WTIOIL-SPOT`).",
      optional: false,
    },
    updates: {
      type: "string",
      label: "Updates",
      description: "Update frequency. Accepted values: `1m` (default), `10m`.",
      optional: false,
      options: ["1m","10m"],
    },
    quote: {
      type: "string",
      label: "Quote",
      description: "Target currency for the exchange rate. Defaults to the market currency of each commodity.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/commodity/rates/latest",
      params: {
        symbols: this.symbols,
        updates: this.updates,
        quote: this.quote,
      },
    });
    $.export("$summary", "Successfully executed Get Latest Commodity Prices");
    return response;
  },
};
