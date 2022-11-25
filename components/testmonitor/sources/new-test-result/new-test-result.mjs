import common from "../common/base.mjs";

export default {
  ...common,
  key: "testmonitor-new-test-result",
  name: "New Test Result",
  description: "Emit new event when a new test result is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.testmonitor.getTestResults;
    },
    getOrderField() {
      return "created_at";
    },
    getDataToEmit({
      id, description, created_at,
    }) {
      return {
        id,
        summary: `New Test Result created (${id} - ${description})`,
        ts: Date.parse(created_at),

      };
    },
  },
};
