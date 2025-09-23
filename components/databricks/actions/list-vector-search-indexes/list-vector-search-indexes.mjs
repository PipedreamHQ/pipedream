import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-list-vector-search-indexes",
  name: "List Vector Search Indexes",
  description: "Lists all vector search indexes for a given endpoint. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/listindexes)",
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
  },

  async run({ $ }) {
    const { vector_indexes = [] } = await this.databricks.listVectorSearchIndexes({
      params: {
        endpoint_name: this.endpointName,
      },
      $,
    });

    $.export(
      "$summary",
      `Successfully retrieved ${vector_indexes.length} index${vector_indexes.length === 1
        ? ""
        : "es"}.`,
    );

    return vector_indexes;
  },
};
