import adanos from "../../adanos.app.mjs";

export default {
  key: "adanos-get-market-sentiment",
  name: "Get Market Sentiment",
  description: "Get an aggregate sentiment overview for stocks or crypto. [See the documentation](https://api.adanos.org/docs)",
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
    const response = await this.adanos.getMarketSentiment({
      $,
      assetType: this.assetType,
      source: this.source,
      fromDate: this.fromDate,
      toDate: this.toDate,
    });
    $.export("$summary", `Retrieved aggregate ${this.assetType} market sentiment.`);
    return response;
  },
};
