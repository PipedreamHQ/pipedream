import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-retrieve-workflow-emails",
  name: "Retrieve Workflow Emails",
  description: "Retrieve emails sent by a workflow by ID. [See the documentation](https://developers.hubspot.com/docs/api-reference/automation-automation-v4-v4/email-campaigns/get-automation-v4-flows-email-campaigns)",
  version: "0.0.2",
  type: "action",
  props: {
    hubspot,
    workflowId: {
      propDefinition: [
        hubspot,
        "workflow",
      ],
    },
    after: {
      type: "string",
      label: "After",
      description: "The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results.",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "The paging cursor token of the last successfully read resource will be returned as the `paging.next.before` JSON property of a paged response containing more results.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to display per page.",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.getWorkflowEmails({
      $,
      params: {
        flowId: this.workflowId,
        after: this.after,
        before: this.before,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.results.length} emails for workflow ${this.workflowId}`);
    return response;
  },
};
