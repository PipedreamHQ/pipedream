import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "neo4j_auradb-new-relationship",
  name: "New Relationship Created",
  description: "Emit new event when a new relationship is created between nodes in the Neo4j AuraDB instance.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    relationshipLabel: {
      type: "string",
      label: "Relationship Label",
      description: "The label of the relationship.",
    },
  },
  methods: {
    ...common.methods,
    getBaseQuery(whereClause) {
      return `MATCH p=()-[n:${this.relationshipLabel}]->() ${whereClause}`;
    },
    emit(item) {
      const ts = (this.orderType === "dateTime")
        ? Date.parse(item[1].properties[this.orderBy])
        : new Date();

      this.$emit(item, {
        id: item.elementId,
        summary: `New Relationship created with label ${this.relationshipLabel}`,
        ts,
      });
    },
  },
  sampleEmit,
};
