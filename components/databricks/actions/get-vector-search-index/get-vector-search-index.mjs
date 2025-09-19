import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-get-vector-search-index",
  name: "Get Vector Search Index",
  description: "Retrieves details about a specific vector search index. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/getindex)",
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
    const response = await this.databricks.getVectorSearchIndex({
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
