import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ragie-new-connection",
  name: "New Ragie Connection Created",
  description: "Emit new event whenever a new connection is created in Ragie. [See the documentation](https://docs.ragie.ai/reference/list_connections_connections_get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.ragie.listConnections;
    },
    getFieldName() {
      return "connections";
    },
    getSummary({
      name, type,
    }) {
      return `New Ragie Connection: ${name} (${type})`;
    },
  },
  sampleEmit,
};
