import filter from "../../filter.app.mjs";
import common from "../common/common.mjs";
import reasons from "../../common/reasons.mjs";

export default {
  ...common,
  name: "End Workflow on Condition",
  version: "0.0.2",
  key: "filter-end-workflow-condition",
  description: "End workflow based on the comparison of 2 values",
  type: "action",
  props: {
    filter,
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
    ...common.props,
  },
  methods: {
    ...common.methods,
    consolidateResult($, result) {
      if (result) {
        return $.flow.exit(this.reasonEnding);
      }
      return $.export("$summary", this.reasonContinuing);
    },
  },
};
