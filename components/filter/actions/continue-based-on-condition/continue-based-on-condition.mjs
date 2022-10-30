import common from "../common/common.mjs";

export default {
  ...common,
  name: "Continue execution if a condition Is met",
  version: "0.0.1",
  key: "filter-continue-based-on-condition",
  description: "Continue workflow execution only if a condition is met",
  type: "action",
  methods: {
    consolidateResult($, result) {
      !result && $.flow.exit(this.messageOnEnd);
      return this.messageOnContinue;
    },
  },
};
