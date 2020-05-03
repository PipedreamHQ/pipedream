const pipedream = require("https://github.com/PipedreamHQ/pipedream/blob/sql/components/pipedream/pipedream.app.js");
module.exports = {
  name: "pipedream-sql",
  version: "0.0.1",
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
    const results = await this.pipedream.runSQLQuery(this.sqlQuery);
    console.log(results);
    // TODO: Check to confirm results is an array.
    // TODO: handle emitEachRecordAsEvent
  },
};
