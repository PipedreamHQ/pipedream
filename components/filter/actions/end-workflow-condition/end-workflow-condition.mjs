import filter from "../../filter.app.mjs";
import common from "../common/common.mjs";
import reasons from "../../common/reasons.mjs";

export default {
  ...common,
  name: "End Workflow on Condition",
  version: "0.0.1",
  key: "filter-end-workflow-condition",
  description: "End workflow based on the comparison of 2 values",
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
        return $.flow.exit(reasons.END);
      }
      return $.export("$summary", this.reason);
    },
  },
};
