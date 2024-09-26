import end from "../../end.app.mjs";

export default {
  name: "End Workflow",
  description: "Terminate workflow execution",
  version: "0.0.3",
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
