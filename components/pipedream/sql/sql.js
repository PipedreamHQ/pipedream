const pipedream = require("https://github.com/PipedreamHQ/pipedream/components/pipedream/pipedream.app.js");

module.exports = {
  name: "New Records from SQL Query",
  description:
    "Runs a query against the Pipedream SQL Service on a schedule, emitting the results in batch (default) or with each record as its own event",
  version: "0.0.2",
  dedupe: "unique", // Dedupes records based on the query execution ID
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        cron: "0 0 * * *",
      },
    },
    sqlQuery: {
      type: "string",
      label: "SQL Query",
      description:
        "Your SQL query (try running in [https://pipedream.com/sql](https://pipedream.com/sql) first)",
    },
    resultType: {
      type: "string",
      label: "Result Type",
      description: `Specifies how you want the query results formatted`,
      optional: true,
      options: ["array", "object", "csv"],
      default: "array",
    },
    emitEachRecordAsEvent: {
      type: "boolean",
      label: "Emit each record as its own event",
      description:
        "If `true`, each record in your results set is emitted as its own event. Defaults to emitting results as a single event (an array of records)",
      optional: true,
      default: false,
    },
    pipedream,
  },
  async run() {
    const results = await this.pipedream.runSQLQuery(
      this.sqlQuery,
      this.resultType
    );
    if (this.resultType === "array" && this.emitEachRecordAsEvent) {
      // First, extract the properties to include in every event
      const { columnInfo, queryExecutionId, csvLocation } = results;
      let event = {
        columnInfo,
        queryExecutionId,
        csvLocation,
      };
      const header = results.results.shift();
      for (const [i, row] of results.results.entries()) {
        let record = {};
        for (const [j, col] of header.entries()) {
          record[col] = row[j];
        }
        // For each record, emit an event
        this.$emit(
          {
            query: this.sqlQuery,
            results: {
              columnInfo,
              queryExecutionId,
              csvLocation,
              record,
            },
          },
          {
            summary: `${this.sqlQuery} - ${i}`,
            id: `${results.queryExecutionId}-${i}`,
          }
        );
      }
      return;
    }
    this.$emit(
      { query: this.sqlQuery, results },
      {
        summary: this.sqlQuery,
        id: results.queryExecutionId,
      }
    );
  },
};
