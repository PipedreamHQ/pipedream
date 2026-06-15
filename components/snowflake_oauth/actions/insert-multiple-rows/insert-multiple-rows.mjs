import snowflake from "../../snowflake_oauth.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

const {
  DEFAULT_BATCH_SIZE,
  MAX_PAYLOAD_SIZE_MB,
  MIN_LIMIT,
  MAX_LIMIT,
  MIN_PAYLOAD_SIZE_MB,
  MAX_PAYLOAD_SIZE_MB_MAX,
} = constants;

export default {
  type: "action",
  key: "snowflake_oauth-insert-multiple-rows",
  name: "Insert Multiple Rows",
  description: "Insert multiple rows into a table. [See the documentation](https://docs.snowflake.com/en/sql-reference/sql/insert)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    snowflake,
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The fully-qualified table where you want to add rows, in `database.schema.table` form. Run the **List Tables** action first to find it.",
    },
    columns: {
      type: "string[]",
      label: "Columns",
      description: "The columns you want to insert data into, in the same order as the values in each row. Run the **List Columns** action (with your fully-qualified table name) first.",
    },
    values: {
      propDefinition: [
        snowflake,
        "values",
      ],
    },
    batchSize: {
      type: "integer",
      label: "Batch Size",
      description: "Number of rows to process per batch. Automatically calculated based on data size if not specified. Recommended: `50-200` for wide tables, `100-500` for narrow tables. (min 1, max 1000)",
      optional: true,
      default: DEFAULT_BATCH_SIZE,
      min: MIN_LIMIT,
      max: MAX_LIMIT,
    },
    maxPayloadSizeMB: {
      type: "integer",
      label: "Max Payload Size (MB)",
      description: "Maximum payload size per batch in MB. Helps prevent `413 Payload Too Large` errors. (min 1, max 10)",
      optional: true,
      default: MAX_PAYLOAD_SIZE_MB,
      min: MIN_PAYLOAD_SIZE_MB,
      max: MAX_PAYLOAD_SIZE_MB_MAX,
    },
    enableBatching: {
      type: "boolean",
      label: "Enable Batch Processing",
      description: "Enable automatic batch processing for large datasets. Disable only for small datasets (< 50 rows) or troubleshooting.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    let rows = this.values;

    let inputValidated = true;

    if (!Array.isArray(rows)) {
      try {
        rows = JSON.parse(rows);
      } catch (parseError) {
        throw new ConfigurationError("The row data could not be parsed as JSON. Please ensure it's a valid JSON array of arrays.");
      }
    }

    if (!rows || !rows.length || !Array.isArray(rows)) {
      inputValidated = false;
    } else {
      rows.forEach((row, index) => {
        if (!Array.isArray(row)) {
          console.log(`Row ${index + 1} is not an array:`, row);
          inputValidated = false;
        }
      });
    }

    if (!inputValidated) {
      throw new ConfigurationError(
        "The row data you passed is not an array of arrays. "
        + "Please enter an array of arrays in the `Values` parameter above. "
        + "If you're trying to add a single row to Snowflake, select the **Insert Single Row** action.",
      );
    }

    const expectedColumnCount = this.columns.length;
    const invalidRows = rows.filter((row, index) => {
      if (row.length !== expectedColumnCount) {
        console.error(`Row ${index + 1} has ${row.length} values but ${expectedColumnCount} columns specified`);
        return true;
      }
      return false;
    });

    if (invalidRows.length) {
      throw new ConfigurationError(
        `${invalidRows.length} rows have a different number of values than the specified columns. `
        + `Each row must have exactly ${expectedColumnCount} values to match the selected columns.`,
      );
    }

    const batchOptions = {
      batchSize: this.batchSize,
      maxPayloadSizeMB: this.maxPayloadSizeMB,
      enableBatching: this.enableBatching,
    };

    const response = await this.snowflake.insertRows(
      this.tableName,
      this.columns,
      rows,
      batchOptions,
    );

    if (response.summary) {
      const { summary } = response;
      $.export("$summary", `Successfully inserted ${summary.totalRowsProcessed} rows into ${this.tableName} using ${summary.totalBatches} batches`);
      $.export("batchDetails", {
        totalRows: summary.totalRows,
        totalBatches: summary.totalBatches,
        successfulBatches: summary.successfulBatches,
        failedBatches: summary.failedBatches,
        batchSize: summary.batchSize,
        processingTime: new Date().toISOString(),
      });
      $.export("batchResults", summary.results);
      return response;
    } else {
      $.export("$summary", `Successfully inserted ${rows.length} rows into ${this.tableName}`);
      return response;
    }
  },
};
