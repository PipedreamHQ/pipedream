import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-retrieve-workflow-emails",
  name: "Retrieve Workflow Emails",
  description: "Retrieve emails associated with a specific workflow. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/get-automation-v3-workflows)",
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
    const response = await this.hubspot.getWorkflowEmails({
      workflowId: this.workflowId,
      $,
    });

    $.export("$summary", `Successfully retrieved emails for workflow ${this.workflowId}`);
    return response;
  },
};
