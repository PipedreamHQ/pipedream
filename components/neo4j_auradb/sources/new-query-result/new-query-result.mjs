import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "neo4j_auradb-new-query-result",
  name: "New Query Result",
  description: "Emit new event when a specified Cypher query returns new results.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    query: {
      type: "string",
      label: "Match Query",
      description: "The Cypher query to monitor for new results. **Only the MATCH query without RETURN**. **Example: MATCH (n:Node)**.",
    },
    variable: {
      type: "string",
      label: "Variable",
      description: "The variable you want to return from the query.",
    },
  },
  methods: {
    ...common.methods,
    getBaseQuery() {
      return this.query;
    },
    getReturnVariable() {
      return this.variable;
    },
    emit(item) {
      const ts = (this.orderType === "dateTime")
        ? Date.parse(item.properties[this.orderBy])
        : new Date();

      this.$emit(item, {
        id: item.elementId,
        summary: `New query result with ID: ${item.elementId}`,
        ts,
      });
    },
  },
  sampleEmit,
};
