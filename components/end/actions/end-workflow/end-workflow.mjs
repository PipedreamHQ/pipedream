import end from "../../end.app.mjs";

export default {
  name: "End Workflow",
  description: "Terminate workflow execution",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
