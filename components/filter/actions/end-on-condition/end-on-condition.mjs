import common from "../common/common.mjs";

export default {
  ...common,
  name: "End on Condition",
  version: "0.0.1",
  key: "filter-end-on-condition",
  description: "End workflow execution based on a condition",
  type: "action",
  methods: {
    consolidateResult($, result) {
      result && $.flow.exit(this.messageOnEnd);
      return this.messageOnContinue;
    },
  },
};
