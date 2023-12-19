import common from "../common/base.mjs";

export default {
  ...common,
  key: "gtmetrix-new-test-completed",
  name: "New Test Completed",
  description: "Emit new event when a test is completed in GTMetrix. [See the documentation](https://gtmetrix.com/api/docs/2.0/#api-test-list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.gtmetrix.listTests;
    },
    getArgs(lastTs) {
      return {
        params: {
          "sort": "-finished",
          "filter[state]": "completed",
          "filter[finished:gt]": lastTs,
        },
      };
    },
    getTsField() {
      return "finished";
    },
    generateMeta(test) {
      return {
        id: test.id,
        summary: `Test ${test.id} completed`,
        ts: test.attributes[this.getTsField()],
      };
    },
  },
};
