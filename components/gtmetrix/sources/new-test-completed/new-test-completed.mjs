import common from "../common/base.mjs";

export default {
  ...common,
  key: "gtmetrix-new-test-completed",
  name: "New Test Completed",
  description: "Emit new event when a test is completed in GTMetrix. [See the documentation](https://gtmetrix.com/api/docs/2.0/#api-test-list)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    testSources: {
      type: "string[]",
      label: "Test Sources",
      description: "The test sources to emit events for",
      options: [
        "api",
        "on-demand",
        "monitored",
      ],
      default: [
        "api",
      ],
    },
  },
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
          "filter[source]": this.testSources.join(", "),
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
