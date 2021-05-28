const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const common = require("../common/bigquery");

module.exports = {
  ...common,
  key: "google_cloud-bigquery-query-results",
  name: "BigQuery - Query Results",
  description: "Emit an event with the results of an arbitrary query",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    sqlQuery: {
      type: "string",
      label: "SQL Query",
      description: "Your SQL query",
    },
    dedupeKey: {
      type: "string",
      label: "De-duplication Key",
      description: `
        The name of a column in the table to use for deduplication. See [the
        docs](https://github.com/PipedreamHQ/pipedream/tree/master/components/google_cloud/sources/bigquery-query-results#technical-details)
        for more info.
      `,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getQueryOpts() {
      return {
        query: this.sqlQuery,
      };
    },
    generateMeta(row, ts) {
      const { [this.dedupeKey]: id = uuidv4() } = row;
      const summary = `New event (ID: ${id})`;
      return {
        id,
        summary,
        ts,
      };
    },
    generateMetaForCollection(rows, ts) {
      const hash = crypto.createHash("sha1");
      rows
        .map(i => i[this.dedupeKey] || uuidv4())
        .map(i => i.toString())
        .forEach(i => hash.update(i));
      const id = hash.digest("base64");
      const summary = `New event (ID: ${id})`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
