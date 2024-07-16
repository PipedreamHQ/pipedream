import end from "../../end.app.mjs";

export default {
  name: "End Workflow",
  description: "Terminate the workflow execution",
  version: "0.0.2",
  type: "action",
  key: "end-end-workflow",
  props: {
    end,
    reason: {
      propDefinition: [
        end,
        "reason",
      ],
    },
  },
  async run({ $ }) {
    $.flow.exit(this.reason);
  },
};
