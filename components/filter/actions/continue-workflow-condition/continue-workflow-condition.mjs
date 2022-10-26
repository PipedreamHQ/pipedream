import filter from "../../filter.app.mjs";
import common from "../common/common.mjs";
import reasons from "../../common/reasons.mjs";

export default {
  ...common,
  name: "Continue Workflow on Condition",
  version: "0.0.2",
  key: "filter-continue-workflow-condition",
  description: "Continue workflow based on the comparison of 2 values",
  type: "action",
  props: {
    filter,
    reasonContinuing: {
      propDefinition: [
        filter,
        "reason",
      ],
      label: "Reason to continue",
      description: "The reason for continuing the workflow",
      default: reasons.CONTINUE,
      optional: true,
    },
    reasonEnding: {
      propDefinition: [
        filter,
        "reason",
      ],
      label: "Reason to end",
      description: "The reason for ending the workflow",
      default: reasons.END,
      optional: true,
    },
    ...common.props,
  },
  methods: {
    ...common.methods,
    consolidateResult($, result) {
      if (result) {
        return $.export("$summary", this.reasonContinuing);
      }
      return $.flow.exit(this.reasonEnding);
    },
  },
};
