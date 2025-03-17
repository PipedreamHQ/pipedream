import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "neo4j_auradb-new-node",
  name: "New Node Created",
  description: "Emit new event when a new node is created in the Neo4j AuraDB instance.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    nodeLabel: {
      type: "string",
      label: "Node Label",
      description: "The label of the node.",
    },
  },
  methods: {
    ...common.methods,
    getBaseQuery(whereClause) {
      return `MATCH (n:${this.nodeLabel}) ${whereClause}`;
    },
    emit(item) {
      const ts = (this.orderType === "dateTime")
        ? Date.parse(item.properties[this.orderBy])
        : new Date();

      this.$emit(item, {
        id: item.elementId,
        summary: `New node created with label ${this.nodeLabel}`,
        ts,
      });
    },
  },
  sampleEmit,
};
