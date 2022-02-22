// legacy_hash_id: a_0Mi0Gd
export default {
  key: "helper_functions-end",
  name: "End Workflow",
  description: "End execution at this step. Later steps in the workflow will not run.",
  version: "0.1.1",
  type: "action",
  props: {
    helper_functions: {
      type: "app",
      app: "helper_functions",
    },
    reason: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    $.flow.exit(this.reason);
    $.export("$summary", `Workflow ended. Reason: \`${this.reason}\``);
  },
};
