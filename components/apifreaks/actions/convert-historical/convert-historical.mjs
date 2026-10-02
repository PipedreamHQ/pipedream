import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-convert-historical",
  name: "Convert Currency With Historical Rates",
  description: "Converts an amount using exchange rates from a specific historical date. [See the documentation](https://apifreaks.com/docs).",
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
    date: {
      type: "string",
      label: "Date",
      description: "Historical date in `YYYY-MM-DD` format.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/currency/converter/historical/prices",
      params: {
        from: this.from,
        to: this.to,
        amount: this.amount,
        date: this.date,
      },
    });
    $.export("$summary", "Successfully executed Convert Currency With Historical Rates");
    return response;
  },
};
