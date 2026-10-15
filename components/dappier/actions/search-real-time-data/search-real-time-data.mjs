import app from "../../dappier.app.mjs";

export default {
  key: "dappier-search-real-time-data",
  name: "Search Real-Time Data",
  description: "Perform a real-time web/data search using a Dappier AI model (POST `/app/aimodel/{ai_model_id}`). Returns an AI-generated `message` synthesized from live web data. Provide an `aiModelId` (prefix `am_`, e.g. `am_01j06ytn18ejftedz6dyhz2b15`) - NOTE this endpoint takes AI-model IDs (`am_`), NOT data-model IDs (`dm_`); for `dm_` data models use **Get AI Recommendations** instead. There is no listing endpoint in the Dappier API; discover valid model IDs in the Dappier Marketplace at https://platform.dappier.com/marketplace. [See the documentation](https://docs.dappier.com/api-reference/endpoint/real-time-search).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    aiModelId: {
      type: "string",
      label: "AI Model ID",
      description: "The Dappier AI model ID to query (prefix `am_`, e.g. `am_01j06ytn18ejftedz6dyhz2b15`). This is an AI-model ID, distinct from the `dm_` data-model IDs used by **Get AI Recommendations**. Discover valid IDs in the Dappier Marketplace: https://platform.dappier.com/marketplace (the Dappier API exposes no listing endpoint).",
    },
    query: {
      propDefinition: [
        app,
        "query",
      ],
      description: "The natural-language search query or prompt to run against the real-time model. Example: `latest AI news`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.searchRealTimeData({
      $,
      aiModelId: this.aiModelId,
      data: {
        query: this.query,
      },
    });
    $.export("$summary", `Successfully retrieved real-time data for query: "${this.query}"`);
    return response;
  },
};
