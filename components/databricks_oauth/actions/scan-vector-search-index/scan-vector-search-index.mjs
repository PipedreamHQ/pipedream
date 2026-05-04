import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-scan-vector-search-index",
  name: "Scan Vector Search Index",
  description:
    "Scans a vector search index and returns entries after the given primary key. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/scanindex)",
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
    lastPrimaryKey: {
      type: "string",
      label: "Last Primary Key",
      description:
        "Primary key of the last entry returned in the previous scan. Leave empty to start from the beginning.",
      optional: true,
    },
    numResults: {
      type: "integer",
      label: "Number of Results",
      description: "Number of results to return (defaults to 10).",
      optional: true,
      default: 10,
    },
  },

  async run({ $ }) {
    const body = {};
    if (this.lastPrimaryKey !== undefined) {
      body.last_primary_key = this.lastPrimaryKey;
    }
    if (this.numResults !== undefined) {
      body.num_results = this.numResults;
    }

    const response = await this.databricks_oauth.scanVectorSearchIndex({
      indexName: this.indexName,
      data: body,
      $,
    });

    $.export(
      "$summary",
      `Scanned index "${this.indexName}" and returned ${response?.data?.length ?? 0} entries.`,
    );
    return response;
  },
};
