// legacy_hash_id: a_0Mi0Gd
import helper_functions from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-end-workflow",
  name: "End Workflow",
  description: "End execution at this step. Later steps in the workflow will not run.",
  version: "0.2.2",
  type: "action",
  props: {
    helper_functions,
    reason: {
      type: "string",
      description: "Enter the reason why the workflow is ending (e.g., \"No record found for user.\")",
      optional: true,
    },
    condition: {
      type: "boolean",
      label: "Condition",
      description: "Enter any expression (e.g., `{{ 2*2 === 4 }}`). If it evaluates to `true`, end workflow. Otherwise, continue.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    if (!this.condition) {
      $.export("$summary", "Workflow continued. Condition evaluated to false.");
      return;
    }
    $.flow.exit(this.reason);
    $.export("$summary", `Workflow ended.${this.reason
      ? ` Reason: \`${this.reason}\``
      : "" }`);
  },
};
