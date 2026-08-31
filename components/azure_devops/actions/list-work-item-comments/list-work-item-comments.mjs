// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-work-item-comments",
  name: "List Work Item Comments",
  description: "List the comments on a work item, newest first. Returns each comment's text, author and creation date. Use this to read the human discussion around an item before acting on it. Example: work item `299`. Returns the newest **Limit** comments, up to the API maximum of 200; the response's `continuationToken` field is present when older comments were not returned. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/comments/get-comments?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    azureDevops,
    organization: {
      propDefinition: [
        azureDevops,
        "organizationName",
      ],
    },
    project: {
      propDefinition: [
        azureDevops,
        "project",
      ],
    },
    workItemId: {
      propDefinition: [
        azureDevops,
        "workItemId",
      ],
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      max: 200,
      description: "Maximum number of comments to return (1-200)",
    },
    includeDeleted: {
      type: "boolean",
      label: "Include Deleted",
      description: "Include deleted comments in the response",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.listWorkItemComments({
      $,
      organization: this.organization,
      project: this.project,
      workItemId: this.workItemId,
      params: {
        $top: this.limit,
        includeDeleted: this.includeDeleted,
      },
    });
    const comments = response.comments ?? [];
    $.export("$summary", `Found ${comments.length} comment${comments.length === 1
      ? ""
      : "s"} on work item ${this.workItemId}`);
    return response;
  },
};
