import agentset from "../../agentset.app.mjs";

export default {
  key: "agentset-search-namespace",
  name: "Agentset Search Namespace",
  description: "Complete retrieval pipeline for RAG with semantic search, filtering, and reranking. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      min: 1,
      max: 100,
      optional: true,
    },
    rerank: {
      type: "boolean",
      label: "Rerank",
      description: "Whether to rerank the results",
      optional: true,
    },
    rerankLimit: {
      type: "integer",
      label: "Rerank Limit",
      description: "The number of results to return after reranking",
      min: 1,
      max: 100,
      optional: true,
    },
    filter: {
      type: "object",
      label: "Filter",
      description: "Filter to apply to search results",
      optional: true,
    },
    minScore: {
      type: "string",
      label: "Minimum Score",
      description: "Minimum score to return. Range from 0 to 1",
      optional: true,
    },
    includeRelationship: {
      type: "boolean",
      label: "Include Relationship",
      description: "Whether to include relationships in the results",
      optional: true,
    },
    includeMetadata: {
      type: "boolean",
      label: "Include Metadata",
      description: "Whether to include metadata in the results",
      optional: true,
    },
  },

  async run({ $ }) {
    const response = await this.agentset.searchNamespace({
      $,
      namespaceId: this.namespaceId,
      data: {
        query: this.query,
        topK: this.topK,
        rerank: this.rerank,
        rerankLimit: this.rerankLimit,
        filter: this.filter,
        minScore: this.minScore && parseFloat(this.minScore),
        includeRelationships: this.includeRelationship,
        includeMetadata: this.includeMetadata,
      },
    });

    $.export("$summary", `Successfully completed the search for query: "${this.query}"`);
    return response;
  },
};
