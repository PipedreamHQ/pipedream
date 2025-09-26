import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-sync-vector-search-index",
  name: "Sync Vector Search Index",
  description: "Synchronize a Delta Sync vector search index in Databricks. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/syncindex)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
  },
  async run({ $ }) {
    const response = await this.databricks.syncVectorSearchIndex({
      indexName: this.indexName,
      $,
    });

    $.export(
      "$summary",
      `Successfully triggered sync for vector search index: ${this.indexName}`,
    );

    return response;
  },
};
