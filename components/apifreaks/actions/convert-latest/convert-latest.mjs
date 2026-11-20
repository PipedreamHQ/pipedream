import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-convert-latest",
  name: "Convert Currency With Latest Rates",
  description: "Converts an amount from one currency to another using the latest exchange rates. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    from: {
      type: "string",
      label: "From",
      description: "Source currency code.",
      optional: false,
    },
    to: {
      type: "string",
      label: "To",
      description: "Target currency code.",
      optional: false,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount to convert as a positive decimal. Defaults to `1`.",
      optional: true,
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
      path: "/v1.0/currency/converter/latest/prices",
      params: {
        from: this.from,
        to: this.to,
        amount: this.amount,
        updates: this.updates,
      },
    });
    $.export("$summary", "Successfully executed Convert Currency With Latest Rates");
    return response;
  },
};
