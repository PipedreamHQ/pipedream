export default {
  name: "End the workflow",
  version: "0.0.{{ts}}",
  key: "end_workflow",
  description: "End execution at this step. Later steps in the workflow will not run.",
  props: {
    reason: {
      type: "string",
      optional: true,
    }
  },
  type: "action",
  async run({ $ }) {
    return $.flow.exit(this.reason);
  },
};
