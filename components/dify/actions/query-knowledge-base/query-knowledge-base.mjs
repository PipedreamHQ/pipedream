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
  description: "Search a Dify knowledge base (dataset) and return the chunks most relevant to a query. Use **List Knowledge Bases** to find the `Knowledge Base ID`. This requires a Dify connection authenticated with a knowledge base API key (issued from a knowledge base's own **API Access** page), not an app API key — those authenticate **Run Workflow** instead. A `401 unauthorized` error here usually means the connected account is using an app key; reconnect with a knowledge base key instead. [See the documentation](https://docs.dify.ai/en/api-reference/knowledge-bases/retrieve-chunks-from-a-knowledge-base-test-retrieval)",
  version: "0.0.1",
  ai: "optimized",
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
      description: "The UUID of the knowledge base to search, e.g. `c42e2a6e-40b3-4330-96f8-f1e4d768e8c9`. Use **List Knowledge Bases** to find valid IDs.",
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

    let scoreThreshold;
    if (this.scoreThreshold !== undefined) {
      scoreThreshold = Number(this.scoreThreshold);
      if (!Number.isFinite(scoreThreshold) || scoreThreshold < 0 || scoreThreshold > 1) {
        throw new ConfigurationError("Score Threshold must be a number between 0 and 1.");
      }
    }

    const useCustomRetrieval = this.searchMethod
      || this.topK !== undefined
      || scoreThreshold !== undefined;
    const retrievalModel = useCustomRetrieval && {
      search_method: this.searchMethod || "hybrid_search",
      reranking_enable: false,
      top_k: this.topK ?? 3,
      score_threshold_enabled: scoreThreshold !== undefined,
      score_threshold: scoreThreshold,
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
