import app from "../../finage.app.mjs";

export default {
  key: "finage-forex-last-quote",
  name: "Forex Last Quote",
  description: "Get the last quote for the specified forex symbol. [See the documentation](https://finage.co.uk/docs/api/forex/forex-last-quote)",
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
    const response = await this.app.forexLastQuote({
      $,
      symbol: this.symbol,
    });
    $.export("$summary", "Successfully retrieved the last quote for " + this.symbol);
    return response;
  },
};
