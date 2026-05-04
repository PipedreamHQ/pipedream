import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-sync-vector-search-index",
  name: "Sync Vector Search Index",
  description: "Synchronize a Delta Sync vector search index in Databricks. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/syncindex)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
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
    const response = await this.databricks_oauth.syncVectorSearchIndex({
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
