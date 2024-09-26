import common from "../common/base.mjs";

export default {
  ...common,
  key: "testmonitor-new-issue",
  name: "New Issue",
  description: "Emit new event when a new issue is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.testmonitor.getIssues;
    },
    getOrderField() {
      return "created_at";
    },
    getDataToEmit({
      id, name, created_at,
    }) {
      return {
        id,
        summary: `New issue created (${name})`,
        ts: Date.parse(created_at),
      };
    },
  },
};
