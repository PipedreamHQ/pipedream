import app from "../../finnhub.app.mjs";

export default {
  key: "finnhub-get-ebitda-estimate",
  name: "Get EBITDA Estimate",
  description: "Get EBITDA estimates for a company. [See the documentation](https://finnhub.io/docs/api/company-ebitda-estimates)",
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
    freq: {
      propDefinition: [
        app,
        "freq",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getEbitdaEstimate({
      $,
      params: {
        symbol: this.symbol,
        freq: this.freq,
      },
    });
    $.export("$summary", `Successfully retrieved EBITDA estimates for ${this.symbol}`);
    return response;
  },
};
