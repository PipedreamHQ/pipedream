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
    // TODO: handle emitEachRecordAsEvent
    this.$emit(results, {
      summary: this.sqlQuery,
      id: results.queryExecutionId,
    });
  },
};
