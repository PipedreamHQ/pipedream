import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "langfuse-new-trace-received",
  name: "New Trace Received",
  description: "Emit new event when a new trace is recorded in Langfuse. [See the documentation](https://api.reference.langfuse.com/#tag/trace/GET/api/public/traces).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "timestamp";
    },
    getResourceName() {
      return "data";
    },
    getResourcesFn() {
      return this.app.listTraces;
    },
    getResourcesFnArgs() {
      return {
        params: {
          orderBy: "timestamp.desc",
          fromTimestamp: this.getLastDateAt(),
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Trace: ${resource.name}`,
        ts: Date.parse(resource.timestamp),
      };
    },
  },
  sampleEmit,
};
