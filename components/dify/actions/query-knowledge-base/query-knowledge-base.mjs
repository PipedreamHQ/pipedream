// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import dify from "../../dify.app.mjs";

const SEARCH_METHODS = [
  "keyword_search",
  "semantic_search",
  "full_text_search",
  "hybrid_search",
];

export default {
  key: "dify-query-knowledge-base",
  name: "Query Knowledge Base",
  description: "Search a Dify knowledge base (dataset) and return the chunks most relevant to a query. Requires a knowledge base API key, which is distinct from the app API key used by **Send Chat Message** and **Run Workflow**. Use **List Knowledge Bases** to find the `Knowledge Base ID`. [See the documentation](https://docs.dify.ai/en/api-reference/knowledge-bases/retrieve-chunks-from-a-knowledge-base-test-retrieval)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    dify,
    datasetId: {
      type: "string",
      label: "Knowledge Base ID",
      description: "The ID of the knowledge base to search. Use **List Knowledge Bases** to find valid IDs.",
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search text, up to 250 characters, e.g. `What is Dify?`",
    },
    searchMethod: {
      type: "string",
      label: "Search Method",
      description: "The retrieval method to use. Setting this, `Top K`, or `Score Threshold` builds a full retrieval configuration for this request (with reranking disabled) instead of using the knowledge base's own configured defaults. Leave all three unset to use the knowledge base's defaults.",
      options: SEARCH_METHODS,
      optional: true,
    },
    topK: {
      type: "integer",
      label: "Top K",
      description: "The maximum number of matching chunks to return. Defaults to `3` if any of `Search Method`, `Top K`, or `Score Threshold` is set.",
      optional: true,
    },
    scoreThreshold: {
      type: "string",
      label: "Score Threshold",
      description: "The minimum similarity score (between `0` and `1`) a chunk must have to be included in the results, e.g. `0.5`. Setting this enables score threshold filtering for this request.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.query.length > 250) {
      throw new ConfigurationError("Query must be 250 characters or fewer.");
    }

    const useCustomRetrieval = this.searchMethod
      || this.topK !== undefined
      || this.scoreThreshold !== undefined;
    const retrievalModel = useCustomRetrieval && {
      search_method: this.searchMethod || "hybrid_search",
      reranking_enable: false,
      top_k: this.topK ?? 3,
      score_threshold_enabled: this.scoreThreshold !== undefined,
      score_threshold: this.scoreThreshold !== undefined
        ? Number(this.scoreThreshold)
        : undefined,
    };

    const response = await this.dify.retrieveFromDataset({
      $,
      datasetId: this.datasetId,
      data: {
        query: this.query,
        retrieval_model: retrievalModel || undefined,
      },
    });

    $.export("$summary", `Found ${response.records.length} matching chunk(s) for "${this.query}"`);
    return response;
  },
};
