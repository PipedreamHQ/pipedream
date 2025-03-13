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
      label: "Cypher Query",
      description: "The Cypher query to monitor for new results. **Example: MATCH (n:Node) RETURN n**",
    },
  },
  methods: {
    ...common.methods,
    getBaseQuery() {
      return this.query;
    },
    emit(item) {
      const ts = (this.orderType === "dateTime")
        ? Date.parse(item[1].properties[this.orderBy])
        : new Date();

      this.$emit(item, {
        id: item[1].elementId,
        summary: "New query result",
        ts,
      });
    },
  },
  sampleEmit,
};
