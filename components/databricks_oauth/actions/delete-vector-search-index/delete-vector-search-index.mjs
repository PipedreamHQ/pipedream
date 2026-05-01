import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-delete-vector-search-index",
  name: "Delete Vector Search Index",
  description: "Deletes a vector search index in Databricks. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/deleteindex)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.databricks_oauth.deleteVectorSearchIndex({
      indexName: this.indexName,
      $,
    });

    $.export("$summary", `Successfully deleted vector search index: ${this.indexName}`);
    return response;
  },
};
