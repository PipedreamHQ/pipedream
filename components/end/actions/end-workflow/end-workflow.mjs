export default ({
  name: "End Workflow",
  description: "Terminate the workflow execution.",
  version: "0.0.1",
  type: "action",
  key: "end_workflow",
  props: {
    reason: {
      type: "string",
      label: "Reason",
      description: "An optional reason why the workflow execution was ended.",
      optional: true,
    },
  },
  async run({ $ }) {
    $.flow.exit(this.reason);
  },
});
