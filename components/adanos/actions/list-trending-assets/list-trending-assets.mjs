import adanos from "../../adanos.app.mjs";

export default {
  key: "adanos-list-trending-assets",
  name: "List Trending Assets",
  description: "Use this action to list stocks or crypto assets ranked by Adanos buzz score. Choose 1 to 100 results, select a source for stocks, and optionally set an inclusive UTC date window in YYYY-MM-DD format. Crypto rankings use Reddit, so the stock source is ignored for crypto. [See the documentation](https://api.adanos.org/docs)",
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
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of results to return, from 1 to 100.",
      min: 1,
      max: 100,
      default: 20,
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
    const response = await this.adanos.getTrendingAssets({
      $,
      assetType: this.assetType,
      source: this.source,
      limit: this.limit,
      fromDate: this.fromDate,
      toDate: this.toDate,
    });
    $.export("$summary", `Retrieved ${response.length} trending ${this.assetType} assets.`);
    return response;
  },
};
