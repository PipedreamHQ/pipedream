import filter from "../../filter.app.mjs";

export default {
  name: "End Workflow on Custom Condition",
  version: "0.0.2",
  key: "filter-end-workflow-custom-condition",
  description: "Stop workflow execution in this step based on any custom condition",
  type: "action",
  props: {
    filter,
    reason: {
      propDefinition: [
        filter,
        "reason",
      ],
      description: "The reason for ending the workflow",
      optional: true,
    },
    condition: {
      type: "boolean",
      label: "Condition",
      description: "Enter any expression (e.g., `{{ 2*2 === 4 }}`). If it evaluates to `true`, end workflow. Otherwise, continue",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.condition) {
      return $.export("$summary", "Workflow continued. Condition evaluated to false");
    }

    let summary = "Workflow ended";
    if (this.reason) {
      summary = `${summary}. Reason: ${this.reason}`;
    }

    $.export("$summary", summary);
    $.flow.exit(this.reason);
  },
};
