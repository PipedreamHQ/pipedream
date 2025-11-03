import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-query-vector-search-index",
  name: "Query Vector Search Index",
  description: "Query a specific vector search index in Databricks. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/queryindex)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    databricks,
    endpointName: {
      propDefinition: [
        databricks,
        "endpointName",
      ],
    },
    indexName: {
      propDefinition: [
        databricks,
        "indexName",
        ({ endpointName }) => ({
          endpointName,
        }),
      ],
    },
    columns: {
      type: "string[]",
      label: "Columns",
      description: "List of column names to include in the response. Example: `[\"id\"]`",
    },
    queryText: {
      type: "string",
      label: "Query Text",
      description: "Free-text query for semantic search.",
      optional: true,
    },
    queryVector: {
      type: "string",
      label: "Query Vector",
      description: "JSON array of floats representing the embedding vector for the query.",
      optional: true,
    },
    filtersJson: {
      type: "string",
      label: "Filters JSON",
      description: "JSON string representing query filters. Example: `{ \"id <\": 5 }`",
      optional: true,
    },
    numResults: {
      type: "integer",
      label: "Number of Results",
      description: "Number of results to return. Defaults to 10.",
      optional: true,
      default: 10,
    },
    includeEmbeddings: {
      type: "boolean",
      label: "Include Embeddings",
      description: "Whether to include the embedding vectors in the results.",
      optional: true,
    },
  },

  async run({ $ }) {
    const payload = {
      columns: this.columns,
      num_results: this.numResults,
    };

    if (this.queryText) payload.query_text = this.queryText;

    if (this.queryVector) {
      try {
        payload.query_vector = JSON.parse(this.queryVector);
        if (
          !Array.isArray(payload.query_vector) ||
          payload.query_vector.length === 0 ||
          !payload.query_vector.every((n) => typeof n === "number" && Number.isFinite(n))
        ) {
          throw new Error("`queryVector` must be a non-empty JSON array of finite numbers.");
        }
      } catch (err) {
        throw new Error(`Invalid queryVector JSON: ${err.message}`);
      }
    }

    if (this.filtersJson) {
      payload.filters_json = this.filtersJson;
    }

    if (this.includeEmbeddings !== undefined) {
      payload.include_embeddings = this.includeEmbeddings;
    }

    const response = await this.databricks.queryVectorSearchIndex({
      indexName: this.indexName,
      data: payload,
      $,
    });

    const count = response?.result?.data_array?.length || 0;
    $.export("$summary", `Retrieved ${count} results from index ${this.indexName}`);

    return response;
  },
};
