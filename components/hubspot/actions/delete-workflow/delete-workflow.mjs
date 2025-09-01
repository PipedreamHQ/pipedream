import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-delete-workflow",
  name: "Delete a Workflow",
  description: "Delete a workflow. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/get-automation-v3-workflows)",
  version: "0.0.21",
  type: "action",
  props: {
    hubspot,
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the workflow to delete",
    },
  },
  async run({ $ }) {
    const { workflowId } = this;

    const response = await this.hubspot.deleteWorkflow({
      workflowId,
      $,
    });

    $.export("$summary", `Successfully deleted workflow ${workflowId}`);
    return response;
  },
};
