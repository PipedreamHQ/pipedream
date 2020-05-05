const pd = require("https://github.com/PipedreamHQ/pipedream/blob/sql/components/pipedream/pipedream.app.js");

module.exports = {
  name: "pipedream-sql",
  version: "0.0.1",
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
        "The Zoom event you'd like to subscribe to (leave blank to subscribe to all events)",
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
    pd,
  },
  async run() {
    const results = await this.pd.runSQLQuery(this.sqlQuery, this.resultType);
    console.log(results);
    if (this.resultType === "array" && this.emitEachRecordAsEvent) {
      // First, extract the properties to include in every event
      const { columnInfo, queryExecutionId, csvLocation } = results;
      let event = {
        columnInfo,
        queryExecutionId,
        csvLocation,
      };
      const header = results.results.shift();
      for (const [i, el] of a.entries()) {
        let record = {};
        for (const [j, col] of header.entries()) {
          record[col] = el[j];
        }
        // For each record, emit an event
        this.$emit(
          {
            columnInfo,
            queryExecutionId,
            csvLocation,
            record,
          },
          {
            summary: `${this.sqlQuery} — ${i}`,
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
