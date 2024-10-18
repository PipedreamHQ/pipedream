import common from "../common/common.mjs";

export default {
  ...common,
  name: "End execution if a condition is met",
  version: "0.0.2",
  key: "filter-end-based-on-condition",
  description: "End workflow execution if a condition is met",
  type: "action",
  props: {
    ...common.props,
    initialValue: {
      ...common.props.initialValue,
      label: "End execution if...",
    },
  },
  methods: {
    consolidateResult($, result) {
      result && $.flow.exit(this.messageOnEnd);
      return this.messageOnContinue;
    },
  },
};
