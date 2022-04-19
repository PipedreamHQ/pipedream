import filter from "../../filter.app.mjs";
import common from "../common/filter-workflow-common.mjs";
import reasons from "../../common/reasons.mjs";

export default {
  ...common,
  name: "Continue Workflow on Condition",
  version: "0.0.1",
  key: "filter-continue-workflow-condition",
  description: "Continue workflow based on the comparison of 2 values",
  type: "action",
  props: {
    filter,
    reason: {
      propDefinition: [
        filter,
        "reason",
      ],
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
        return $.export("$summary", this.reason);
      }
      return $.flow.exit(reasons.END);
    },
  },
};
