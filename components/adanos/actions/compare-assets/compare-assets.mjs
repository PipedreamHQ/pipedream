import adanos from "../../adanos.app.mjs";

export default {
  key: "adanos-compare-assets",
  name: "Compare Assets",
  description: "Use this action to compare sentiment and attention metrics for up to 10 stocks or crypto assets. Provide stock tickers such as AAPL or crypto symbols such as BTC, select a source for stocks, and optionally set an inclusive UTC date window in YYYY-MM-DD format. Crypto comparisons use Reddit, so the stock source is ignored for crypto. [See the documentation](https://api.adanos.org/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    adanos,
    assetType: {
      propDefinition: [
        adanos,
        "assetType",
      ],
    },
    source: {
      propDefinition: [
        adanos,
        "source",
      ],
      description: "The source used for stocks. Crypto currently uses Reddit.",
    },
    identifiers: {
      type: "string[]",
      label: "Tickers or Symbols",
      description: "The assets to compare, such as `AAPL`, `MSFT`, and `NVDA` for stocks or `BTC`, `ETH`, and `SOL` for crypto. Up to 10 values are supported.",
    },
    fromDate: {
      propDefinition: [
        adanos,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        adanos,
        "toDate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.adanos.compareAssets({
      $,
      assetType: this.assetType,
      source: this.source,
      identifiers: this.identifiers,
      fromDate: this.fromDate,
      toDate: this.toDate,
    });
    const count = response.stocks?.length ?? response.tokens?.length ?? 0;
    $.export("$summary", `Compared ${count} ${this.assetType} assets.`);
    return response;
  },
};
