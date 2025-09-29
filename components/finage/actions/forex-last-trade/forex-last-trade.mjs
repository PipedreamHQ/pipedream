import app from "../../finage.app.mjs";

export default {
  key: "finage-forex-last-trade",
  name: "Forex Last Trade",
  description: "Get the last trade for the specified forex symbol. [See the documentation](https://finage.co.uk/docs/api/forex/forex-last-trade)",
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
    const response = await this.app.forexLastTrade({
      $,
      symbol: this.symbol,
    });
    $.export("$summary", "Successfully retrieved the last trade for " + this.symbol);
    return response;
  },
};
