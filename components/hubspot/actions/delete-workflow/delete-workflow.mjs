import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-delete-workflow",
  name: "Delete a Workflow",
  description: "Delete a workflow by ID. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/delete-automation-v3-workflows-workflowId)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
