import adanos from "../../adanos.app.mjs";

export default {
  key: "adanos-list-trending-assets",
  name: "List Trending Assets",
  description: "List stocks or crypto assets ranked by Adanos buzz score. [See the documentation](https://api.adanos.org/docs)",
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
    const response = await this.adanos.getTrending({
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
