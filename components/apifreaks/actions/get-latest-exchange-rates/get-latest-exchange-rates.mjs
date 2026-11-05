import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-latest-exchange-rates",
  name: "Get the Latest Exchange Rates",
  description: "Returns the latest exchange rates for the requested base currency and symbols. [See the documentation](https://apifreaks.com/docs).",
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
      propDefinition: [
        app,
        "symbols",
      ],
    },
    updates: {
      type: "string",
      label: "Updates",
      description: "Update frequency: `1m` (default), `10m`, `1h`, or `1d`.",
      optional: true,
      options: ["1m","10m","1h","1d"],
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/currency/rates/latest",
      params: {
        base: this.base,
        symbols: this.symbols,
        updates: this.updates,
      },
    });
    $.export("$summary", "Successfully executed Get the Latest Exchange Rates");
    return response;
  },
};
