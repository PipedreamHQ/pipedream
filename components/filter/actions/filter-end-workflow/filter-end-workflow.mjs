import filter from "../../filter.app.mjs";
import reasons from "../../common/reasons.mjs";

export default {
  name: "End Workflow",
  version: "0.0.1",
  key: "filter-end-workflow",
  description: "Stop workflow execution in this step",
  type: "action",
  props: {
    filter,
    reason: {
      propDefinition: [
        filter,
        "reason",
      ],
      description: "The reason for ending the workflow",
      default: reasons.END,
      optional: true,
    },
  },
  async run({ $ }) {
    return $.flow.exit(this.reason);
  },
};
