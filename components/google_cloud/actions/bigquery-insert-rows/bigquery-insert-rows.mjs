import googleCloud from "../../google_cloud.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Bigquery Insert Rows",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "google_cloud-bigquery-insert-rows",
  type: "action",
  description: "Inserts rows into a BigQuery table. [See the docs](https://github.com/googleapis/nodejs-bigquery) and for an example [here](https://github.com/googleapis/nodejs-bigquery/blob/main/samples/insertRowsAsStream.js).",
  props: {
    googleCloud,
    datasetId: {
      propDefinition: [
        googleCloud,
        "datasetId",
      ],
    },
    tableId: {
      propDefinition: [
        googleCloud,
        "tableId",
        ({ datasetId }) => ({
          datasetId,
        }),
      ],
    },
    rows: {
      type: "string[]",
      label: "Rows",
      description: "The rows to insert into the table. Each row is a JSON object with column names as keys and rows as values. E.g. `{\"name\": \"John\", \"age\": 20}`",
    },
  },
  async run({ $ }) {
    const {
      datasetId,
      tableId,
      rows,
    } = this;

    if (!Array.isArray(rows)) {
      throw new Error("Rows must be an array");
    }

    const rowsParsed = rows.map(utils.parse);

    try {
      const response = await this.googleCloud
        .getBigQueryClient()
        .dataset(datasetId)
        .table(tableId)
        .insert(rowsParsed);

      $.export("$summary", `Successfully inserted ${rows.length} rows into ${datasetId}.${tableId}`);

      return response;
    } catch (error) {
      console.log(JSON.stringify(error.errors, null, 2));
      throw error;
    }
  },
};
