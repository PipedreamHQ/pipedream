import databricks from "../../databricks.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "databricks-upsert-vector-search-index",
  name: "Upsert Vector Search Index Data",
  description: "Upserts (inserts/updates) data into an existing vector search index. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/upsertdatavectorindex)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
    indexName: {
      propDefinition: [
        databricks,
        "indexName",
      ],
    },
    rows: {
      type: "string[]",
      label: "Rows to Upsert",
      description: "Array of rows to upsert. Each row should be a JSON object string. Example: `{ \"id\": \"1\", \"text\": \"hello world\", \"text_vector\": [1.0, 2.0, 3.0] }`",
    },
  },

  async run({ $ }) {
    const parsedRows = utils.parseObject(this.rows);

    if (!Array.isArray(parsedRows) || !parsedRows.length) {
      throw new ConfigurationError("rows must be a non-empty array of JSON objects.");
    }

    parsedRows.forEach((row, idx) => {
      if (!row || typeof row !== "object") {
        throw new ConfigurationError(`Row at index ${idx} is invalid. Each row must be a JSON object.`);
      }
      if (!row.id) {
        throw new ConfigurationError(`Row at index ${idx} is missing required primary key field "id".`);
      }
    });

    const payload = {
      index_name: this.indexName,
      inputs_json: JSON.stringify(parsedRows),
    };

    const response = await this.databricks.upsertVectorSearchIndex({
      data: payload,
      $,
    });

    $.export("$summary", `Successfully upserted ${parsedRows.length} row(s) into index ${this.indexName}`);
    return response;
  },
};
