import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-launch-workflow",
  name: "Launch Workflow",
  description: "Launches a new workflow in Ironclad. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ironclad,
    workflowDetails: {
      propDefinition: [
        ironclad,
        "workflowDetails",
      ],
    },
    attachments: {
      propDefinition: [
        ironclad,
        "attachments",
      ],
      optional: true,
    },
    user: {
      propDefinition: [
        ironclad,
        "user",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ironclad.launchWorkflow(
      this.workflowDetails,
      this.attachments,
      this.user,
    );
    const workflowId = response.id || response.workflowId || "unknown";
    $.export("$summary", `Workflow launched successfully with ID ${workflowId}`);
    return response;
  },
};
