import app from "../../finnhub.app.mjs";

export default {
  key: "finnhub-get-insider-transactions",
  name: "Get Insider Transactions",
  description: "Get a list of insider transactions from a specified time period. [See the documentation](https://finnhub.io/docs/api/insider-transactions)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    symbol: {
      propDefinition: [
        app,
        "symbol",
      ],
    },
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getInsiderTransactions({
      $,
      params: {
        symbol: this.symbol,
        from: this.from,
        to: this.to,
      },
    });
    $.export("$summary", "Successfully retrieved " + response.data.length + " transactions");
    return response;
  },
};
