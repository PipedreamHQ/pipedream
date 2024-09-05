import common from "../common.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  ...common,
  type: "source",
  key: "snowflake-query-results",
  name: "New Query Results",
  // eslint-disable-next-line
  description: "Run a SQL query on a schedule, triggering a workflow for each row of results",
  version: "0.2.2",
  props: {
    ...common.props,
    sqlQuery: {
      type: "string",
      label: "SQL Query",
      description: "Run this query on a schedule, triggering the workflow for each row of results",
    },
    // Ordering props correctly
    timer: common.props.timer,
    dedupeKey: {
      type: "string",
      label: "Primary key",
      description: "The column in your query to use for de-duplication. Duplicate rows won't trigger your workflow",
      optional: true,
    },
    emitIndividualEvents: {
      propDefinition: [
        common.props.snowflake,
        "emitIndividualEvents",
      ],
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
