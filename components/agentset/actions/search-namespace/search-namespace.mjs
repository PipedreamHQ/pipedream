import agentset from "../../agentset.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agentset-search-namespace",
  name: "Agentset Search Namespace",
  description: "Complete retrieval pipeline for RAG with semantic search, filtering, and reranking. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/search)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    agentset,
    namespaceId: {
      propDefinition: [
        agentset,
        "namespaceId",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query for semantic search",
    },
    topK: {
      type: "integer",
      label: "Top K",
      description: "Number of top documents to return",
      optional: true,
    },
    rerank: {
      type: "boolean",
      label: "Rerank",
      description: "Rerank documents based on query",
      optional: true,
    },
    rerankLimit: {
      type: "integer",
      label: "Rerank Limit",
      description: "Limit for reranking documents",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter to apply to search results",
      optional: true,
    },
    minScore: {
      type: "number",
      label: "Minimum Score",
      description: "Minimum score threshold for results",
      optional: true,
    },
    includeRelationship: {
      type: "boolean",
      label: "Include Relationship",
      description: "Include relationship data in results",
      optional: true,
    },
    includeMetadata: {
      type: "boolean",
      label: "Include Metadata",
      description: "Include metadata in results",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.agentset.searchNamespace(this.namespaceId, this.query, {
      topK: this.topK,
      rerank: this.rerank,
      rerankLimit: this.rerankLimit,
      filter: this.filter,
      minScore: this.minScore,
      includeRelationships: this.includeRelationship,
      includeMetadata: this.includeMetadata,
    });

    $.export("$summary", `Successfully completed the search for query: "${this.query}"`);
    return response;
  },
};
