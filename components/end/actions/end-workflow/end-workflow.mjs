import end from "../../end.app.mjs";

export default {
  key: "end-end-workflow",
  name: "End Workflow",
  description: "End execution at this step. Later steps in the workflow will not run.",
  version: "0.0.1",
  type: "action",
  props: {
    end,
    reason: {
      propDefinition: [
        end,
        "reason",
      ],
    },
    condition: {
      propDefinition: [
        end,
        "condition",
      ],
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
