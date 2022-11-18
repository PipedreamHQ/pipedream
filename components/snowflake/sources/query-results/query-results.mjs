import common from "../common.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  ...common,
  type: "source",
  key: "snowflake-query-results",
  name: "New Query Results",
  description: "Emit new event with the results of an arbitrary query",
  version: "0.0.3",
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
      description: "The name of a column in the table to use for de-duplication",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    generateMeta(data) {
      const {
        row: { [this.dedupeKey]: id = uuidv4() },
        timestamp: ts,
      } = data;
      const summary = `New event (ID: ${id})`;
      return {
        id,
        summary,
        ts,
      };
    },
    generateMetaForCollection(data) {
      const { timestamp: ts } = data;
      const id = uuidv4();
      const summary = `New event (ID: ${id})`;
      return {
        id,
        summary,
        ts,
      };
    },
    getStatement() {
      return {
        sqlText: this.sqlQuery,
      };
    },
  },
};
