import common from "../common/common.mjs";

export default {
  ...common,
  name: "End execution if a condition is met",
  version: "0.0.1",
  key: "filter-end-based-on-condition",
  description: "End workflow execution if a condition is met",
  type: "action",
  methods: {
    consolidateResult($, result) {
      result && $.flow.exit(this.messageOnEnd);
      return this.messageOnContinue;
    },
  },
};
