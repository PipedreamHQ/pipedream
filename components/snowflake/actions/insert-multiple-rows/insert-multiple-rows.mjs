import snowflake from "../../snowflake.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "action",
  key: "snowflake-insert-multiple-rows",
  name: "Insert Multiple Rows",
  description: "Insert multiple rows into a table",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    snowflake,
    database: {
      propDefinition: [
        snowflake,
        "database",
      ],
    },
    schema: {
      propDefinition: [
        snowflake,
        "schema",
        (c) =>  ({
          database: c.database,
        }),
      ],
    },
    tableName: {
      propDefinition: [
        snowflake,
        "tableName",
        (c) => ({
          database: c.database,
          schema: c.schema,
        }),
      ],
      description: "The table where you want to add rows",
    },
    columns: {
      propDefinition: [
        snowflake,
        "columns",
        (c) => ({
          tableName: c.tableName,
        }),
      ],
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
      description: "Number of rows to process per batch. Automatically calculated based on data size if not specified. Recommended: `50-200` for wide tables, `100-500` for narrow tables.",
      optional: true,
      default: 100,
      min: 10,
      max: 1000,
    },
    maxPayloadSizeMB: {
      type: "integer",
      label: "Max Payload Size (MB)",
      description: "Maximum payload size per batch in MB. Helps prevent `413 Payload Too Large` errors.",
      optional: true,
      default: 5,
      min: 1,
      max: 10,
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

    // Throw an error if input validation failed
    if (!inputValidated) {
      throw new ConfigurationError("The row data you passed is not an array of arrays. Please enter an array of arrays in the `Values` parameter above. If you're trying to add a single row to Snowflake, select the **Insert Single Row** action.");
    }

    const expectedColumnCount = this.columns.length;
    const invalidRows = rows.filter((row, index) => {
      if (row.length !== expectedColumnCount) {
        console.error(`Row ${index + 1} has ${row.length} values but ${expectedColumnCount} columns specified`);
        return true;
      }
      return false;
    });

    if (invalidRows.length > 0) {
      throw new ConfigurationError(`${invalidRows.length} rows have a different number of values than the specified columns. Each row must have exactly ${expectedColumnCount} values to match the selected columns.`);
    }

    // Add batch processing options
    const batchOptions = {
      batchSize: this.batchSize,
      maxPayloadSizeMB: this.maxPayloadSizeMB,
      enableBatching: this.enableBatching,
    };

    try {
      const response = await this.snowflake.insertRows(
        this.tableName,
        this.columns,
        rows,
        batchOptions,
      );

      // Handle different response formats (batched vs single insert)
      if (response.summary) {
        // Batched response
        const { summary } = response;
        $.export("$summary", `Successfully inserted ${summary.totalRowsProcessed} rows into ${this.tableName} using ${summary.totalBatches} batches`);

        // Export detailed batch information
        $.export("batchDetails", {
          totalRows: summary.totalRows,
          totalBatches: summary.totalBatches,
          successfulBatches: summary.successfulBatches,
          failedBatches: summary.failedBatches,
          batchSize: summary.batchSize,
          processingTime: new Date().toISOString(),
        });

        // Export batch results for debugging if needed
        $.export("batchResults", summary.results);

        return response;

      } else {
        // Single insert response (small dataset or batching disabled)
        $.export("$summary", `Successfully inserted ${rows.length} rows into ${this.tableName}`);
        return response;
      }

    } catch (error) {
      // Enhanced error handling for batch processing
      if (error.summary) {
        // Partial failure in batch processing
        const { summary } = error;
        $.export("$summary", `Partial success: ${summary.totalRowsProcessed}/${summary.totalRows} rows inserted. ${summary.failedBatches} batches failed.`);
        $.export("batchDetails", summary);
        $.export("failedBatches", summary.results.filter((r) => !r.success));
      }

      // Re-throw the error with additional context
      if (error.message.includes("413") || error.message.includes("Payload Too Large")) {
        throw new ConfigurationError(
          `Payload too large error detected. Try reducing the batch size (current: ${this.batchSize}) or enable batching if disabled. ` +
          `You're trying to insert ${rows.length} rows with ${this.columns.length} columns each. ` +
          `Original error: ${error.message}`,
        );
      }

      throw error;
    }
  },
};
