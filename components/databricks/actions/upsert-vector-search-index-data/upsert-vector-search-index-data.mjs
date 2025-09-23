import databricks from "../../databricks.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "databricks-upsert-vector-search-index-data",
  name: "Upsert Vector Search Index Data",
  description: "Upserts (inserts/updates) data into an existing vector search index. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/upsertdatavectorindex)",
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
    rows: {
      type: "string",
      label: "Rows to Upsert",
      description: "Array of rows to upsert. Each row should be a JSON object string. Example: `[{ \"id\": \"1\", \"text\": \"hello world\", \"text_vector\": [0.1, 0.2, 0.3] }]`",
    },
  },

  async run({ $ }) {
    const parsedRows = utils.parseObject(this.rows);

    if (!Array.isArray(parsedRows) || !parsedRows.length) {
      throw new ConfigurationError("rows must be a non-empty JSON array.");
    }

    const response = await this.databricks.upsertVectorSearchIndexData({
      indexName: this.indexName,
      data: {
        inputs_json: JSON.stringify(parsedRows),
      },
      $,
    });

    $.export("$summary", `Successfully upserted ${parsedRows.length} row(s) into index ${this.indexName}`);
    return response;
  },
};
