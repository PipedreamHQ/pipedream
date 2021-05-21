const { v4: uuidv4 } = require("uuid");
const common = require("../common");

module.exports = {
  ...common,
  key: "snowflake-query-results",
  name: "Query Results",
  description: "Emit an event with the results of an arbitrary query",
  version: "0.0.1",
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
        row: {
          [this.dedupeKey]: id = uuidv4(),
        },
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
      const {
        timestamp: ts,
      } = data;
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
