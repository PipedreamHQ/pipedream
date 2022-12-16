import drip from "../../drip.app.mjs";

export default {
  key: "drip-activate-workflow",
  name: "Activate Workflow",
  version: "0.0.1",
  description: "Activate a workflow. [See the docs here](https://developer.drip.com/#activate-a-workflow)",
  type: "action",
  props: {
    drip,
    workflowId: {
      type: "string",
      label: "Workflow Id",
      description: "The workflows's id.",
      async options({ page }) {
        const { workflows } = await this.drip.listWorkflows({
          params: {
            page,
          },
        });

        return workflows.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
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
