import common from "../common/base.mjs";

export default {
  ...common,
  key: "bugbug-new-cloud-test-run-failed",
  name: "New Cloud Test Run Failed",
  description: "Emit new event when any test failed when running in the BugBug Cloud.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    test: {
      propDefinition: [
        common.props.bugbug,
        "test",
      ],
    },
  },
  methods: {
    ...common.methods,
    getParams() {
      return {
        test_id: this.test,
      };
    },
    getRelevantRuns(runs = []) {
      return runs.filter((run) => run.status === "failed" && run.runMode === "server");
    },
  },
};
