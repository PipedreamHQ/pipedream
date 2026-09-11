import app from "../../finnhub.app.mjs";

export default {
  key: "finnhub-get-ebitda-estimate",
  name: "Get EBITDA Estimate",
  description: "Retrieves EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) estimates for a specified company. Returns analyst consensus estimates including average, high, and low values for annual or quarterly periods. Requires a premium Finnhub API subscription. [See the documentation](https://finnhub.io/docs/api/company-ebitda-estimates)",
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
