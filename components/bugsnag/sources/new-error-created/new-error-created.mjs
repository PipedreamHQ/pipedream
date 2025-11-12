import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bugsnag-new-error-created",
  name: "New Error Created",
  description: "Emit new event when a new error occurs in a selected project.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.bugsnag.listErrors;
    },
    getArgs() {
      return {
        projectId: this.projectId,
        params: {
          sort: "first_seen",
          direction: "desc",
        },
      };
    },
    getTsField() {
      return "first_seen";
    },
    getSummary(item) {
      return `New Error ID: ${item.id}`;
    },
  },
  sampleEmit,
};
