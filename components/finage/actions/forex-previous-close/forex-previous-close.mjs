import app from "../../finage.app.mjs";

export default {
  key: "finage-forex-previous-close",
  name: "Forex Previous Close",
  description: "Get the previous close for the specified forex symbol. [See the documentation](https://finage.co.uk/docs/api/forex/forex-previous-close)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    symbol: {
      propDefinition: [
        app,
        "symbol",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.forexPreviousClose({
      $,
      symbol: this.symbol,
    });
    $.export("$summary", "Successfully retrieved the previous close for " + this.symbol);
    return response;
  },
};
