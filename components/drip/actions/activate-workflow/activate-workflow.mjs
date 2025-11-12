import drip from "../../drip.app.mjs";

export default {
  key: "drip-activate-workflow",
  name: "Activate Workflow",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Activate a workflow. [See the docs here](https://developer.drip.com/#activate-a-workflow)",
  type: "action",
  props: {
    drip,
    workflowId: {
      propDefinition: [
        drip,
        "workflowId",
      ],
    },
  },
  async run({ $ }) {
    const { workflowId } = this;

    const response = await this.drip.activateWorkflow({
      $,
      workflowId,
    });

    $.export("$summary", "Workflow Successfully activated");
    return response;
  },
};
