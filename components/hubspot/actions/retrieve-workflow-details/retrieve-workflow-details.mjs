import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-retrieve-workflow-details",
  name: "Retrieve Workflow Details",
  description: "Retrieve detailed information about a specific workflow. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/get-automation-v3-workflows)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    workflowId: {
      propDefinition: [
        hubspot,
        "workflowId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.getWorkflowDetails({
      workflowId: this.workflowId,
      $,
    });

    $.export("$summary", `Successfully retrieved details for workflow ${this.workflowId}`);
    return response;
  },
};
