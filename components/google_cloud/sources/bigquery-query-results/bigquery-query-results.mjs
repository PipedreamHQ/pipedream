import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import common from "../common/bigquery.mjs";

export default {
  ...common,
  key: "google_cloud-bigquery-query-results",
  // eslint-disable-next-line pipedream/source-name
  name: "BigQuery - Query Results",
  description: "Emit new events with the results of an arbitrary query",
  version: "0.1.9",
  dedupe: "unique",
  type: "source",
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
      description: "The name of a column in the table to use for deduplication. See [the docs](https://github.com/PipedreamHQ/pipedream/tree/master/components/google_cloud/sources/bigquery-query-results#technical-details) for more info.",
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
      // Process rows incrementally to avoid memory accumulation
      for (const row of rows) {
        const key = row[this.dedupeKey] || uuidv4();
        hash.update(key.toString());
      }
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
