import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-delete-workflow",
  name: "Delete a Workflow",
  description: "Delete a workflow by ID. [See the documentation](https://developers.hubspot.com/docs/api-reference/automation-automation-v4-v4/workflows/delete-automation-v4-flows-flowId)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    workflowId: {
      propDefinition: [
        hubspot,
        "workflow",
      ],
      description: "The ID of the workflow to delete",
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.deleteWorkflow({
      workflowId: this.workflowId,
      $,
    });

    $.export("$summary", `Successfully deleted workflow ${this.workflowId}`);
    return response;
  },
};
