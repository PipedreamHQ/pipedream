import common from "../common/common.mjs";

export default {
  ...common,
  name: "Continue execution if a condition Is met",
  version: "0.0.2",
  key: "filter-continue-based-on-condition",
  description: "Continue workflow execution only if a condition is met",
  type: "action",
  props: {
    ...common.props,
    initialValue: {
      ...common.props.initialValue,
      label: "Only continue if...",
    },
  },
  methods: {
    consolidateResult($, result) {
      !result && $.flow.exit(this.messageOnEnd);
      return this.messageOnContinue;
    },
  },
};
