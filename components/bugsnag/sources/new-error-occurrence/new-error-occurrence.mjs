import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bugsnag-new-error-occurrence",
  name: "New Error Occurrence",
  description: "Emit new event when an existing error receives a new occurrence.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.bugsnag.listEvents;
    },
    getArgs() {
      return {
        projectId: this.projectId,
        params: {
          sort: "timestamp",
          direction: "desc",
        },
      };
    },
    getTsField() {
      return "received_at";
    },
    getSummary(item) {
      return `New Error Event ID: ${item.id}`;
    },
  },
  sampleEmit,
};
