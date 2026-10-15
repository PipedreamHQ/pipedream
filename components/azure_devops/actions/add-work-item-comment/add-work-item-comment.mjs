import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-add-work-item-comment",
  name: "Add Work Item Comment",
  description: "Add a comment to a work item's discussion thread. Returns the new comment's id and rendered text. Use this to post automated status back to the item humans are watching, rather than editing its description. Example: work item `299`, comment `Deployed to staging in build 4821`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/comments/add?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    text: {
      propDefinition: [
        azureDevops,
        "commentText",
      ],
      description: "Text of the comment. HTML is supported.",
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.addWorkItemComment({
      $,
      organization: this.organization,
      project: this.project,
      workItemId: this.workItemId,
      data: {
        text: this.text,
      },
    });
    $.export("$summary", `Added comment ${response.id} to work item ${this.workItemId}`);
    return response;
  },
};
