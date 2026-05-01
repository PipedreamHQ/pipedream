import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-get-vector-search-index",
  name: "Get Vector Search Index",
  description: "Retrieves details about a specific vector search index. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/getindex)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    databricks_oauth,
    endpointName: {
      propDefinition: [
        databricks_oauth,
        "endpointName",
      ],
    },
    indexName: {
      propDefinition: [
        databricks_oauth,
        "indexName",
        ({ endpointName }) => ({
          endpointName,
        }),
      ],
    },
  },

  async run({ $ }) {
    const response = await this.databricks_oauth.getVectorSearchIndex({
      indexName: this.indexName,
      $,
    });

    $.export(
      "$summary",
      `Successfully retrieved vector search index: ${this.indexName}`,
    );
    return response;
  },
};
