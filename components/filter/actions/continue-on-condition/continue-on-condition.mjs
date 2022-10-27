import common from "../common/common.mjs";

export default {
  ...common,
  name: "Continue on Condition",
  version: "0.0.1",
  key: "filter-continue-on-condition",
  description: "Continue workflow execution based on a condition",
  type: "action",
  methods: {
    consolidateResult($, result) {
      !result && $.flow.exit(this.messageOnEnd);
      return this.messageOnContinue;
    },
  },
};
