import app from "../../dappier.app.mjs";
import { SEARCH_ALGORITHMS } from "../../common/constants.mjs";
import { pluckFields } from "../../common/utils.mjs";

export default {
  key: "dappier-get-ai-recommendations",
  name: "Get AI Recommendations",
  description: "Get AI-ranked content recommendations for a Dappier data model (POST `/app/v2/search`, with `data_model_id` passed as a query parameter). Returns a structured `results` array of ranked articles (title, summary, url, score, source, pubdate, etc.). Provide a `dataModelId` (prefix `dm_`, e.g. `dm_01hpsxyfm2fwdt2zet9cg6fdxt` - a known real-time web search data model). NOTE `dm_` data-model IDs are distinct from the `am_` AI-model IDs used by **Search Real-Time Data**. There is no listing endpoint in the Dappier API; discover valid data model IDs in the Dappier Marketplace at https://platform.dappier.com/marketplace. Example: `dataModelId=dm_01hpsxyfm2fwdt2zet9cg6fdxt`, `query=top technology stories today` returns the top-ranked matching articles; pass `fields=[\"title\",\"url\",\"summary\"]` to trim each result to just those keys. [See the documentation](https://docs.dappier.com/api-reference/endpoint/ai-recommendations).",
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
    dataModelId: {
      type: "string",
      label: "Data Model ID",
      description: "The Dappier data model ID to query (prefix `dm_`, e.g. `dm_01hpsxyfm2fwdt2zet9cg6fdxt`, a known real-time web search data model). This is a data-model ID, distinct from the `am_` AI-model IDs used by **Search Real-Time Data**. Discover valid IDs in the Dappier Marketplace: https://platform.dappier.com/marketplace (the Dappier API exposes no listing endpoint). Sent as the `data_model_id` query parameter.",
    },
    query: {
      propDefinition: [
        app,
        "query",
      ],
      description: "The natural-language query or context used to rank recommendations. Example: `top technology stories today`.",
    },
    searchAlgorithm: {
      type: "string",
      label: "Search Algorithm",
      description: "Ranking algorithm to apply. One of: `most_recent`, `semantic`, `most_recent_semantic`, `trending`. Defaults to `semantic`.",
      options: SEARCH_ALGORITHMS,
      optional: true,
    },
    similarityTopK: {
      type: "integer",
      label: "Similarity Top K",
      description: "Number of top semantically similar items to consider. Min 1, max 1000. Defaults to 9.",
      min: 1,
      max: 1000,
      optional: true,
    },
    numResults: {
      type: "integer",
      label: "Number of Results",
      description: "Number of recommendation results to return. Min 1, max 100. Defaults to 10.",
      min: 1,
      max: 100,
      optional: true,
    },
    numArticlesRef: {
      type: "integer",
      label: "Number of Articles from Ref",
      description: "Minimum number of articles to return from the `ref` domain. Min 0 (0 = no domain-specific articles required), max 100. Defaults to 0.",
      min: 0,
      max: 100,
      optional: true,
    },
    ref: {
      type: "string",
      label: "Ref Domain",
      description: "Site domain to prioritize for display in results (e.g. `example.com`). Optional.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Result page number for pagination. Min 1. Defaults to 1.",
      min: 1,
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional allow-list of keys to keep on each returned article, to trim large payloads (e.g. `title`, `url`, `summary`, `score`). Omit to return every field. Available keys: `author`, `image_url`, `preview_content`, `pubdate`, `pubdate_unix`, `score`, `site`, `site_domain`, `source_url`, `summary`, `title`, `url`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getAiRecommendations({
      $,
      dataModelId: this.dataModelId,
      data: {
        query: this.query,
        search_algorithm: this.searchAlgorithm,
        similarity_top_k: this.similarityTopK,
        num_articles_ref: this.numArticlesRef,
        num_results: this.numResults,
        ref: this.ref,
        page: this.page,
      },
    });
    if (this.fields?.length && Array.isArray(response?.response?.results)) {
      response.response.results = pluckFields(response.response.results, this.fields);
    }
    const count = response?.response?.results?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} AI recommendation${count === 1
      ? ""
      : "s"} for query: "${this.query}"`);
    return response;
  },
};
