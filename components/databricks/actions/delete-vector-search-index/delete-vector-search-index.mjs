import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-delete-vector-search-index",
  name: "Delete Vector Search Index",
  description: "Deletes a vector search index in Databricks. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/deleteindex)",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const response = await this.databricks.deleteVectorSearchIndex({
      indexName: this.indexName,
      $,
    });

    $.export("$summary", `Successfully deleted vector search index: ${this.indexName}`);
    return response;
  },
};
