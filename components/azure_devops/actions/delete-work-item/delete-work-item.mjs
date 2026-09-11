import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-delete-work-item",
  name: "Delete Work Item",
  description: "Move a work item to the project's recycle bin, or permanently destroy it when **Destroy** is set. Returns the deleted item's id and code. Use this to clean up items created in error - prefer the recycle bin, which is recoverable. Example: work item `299`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/delete?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
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
    destroy: {
      type: "boolean",
      label: "Destroy",
      description: "Permanently delete the work item instead of moving it to the recycle bin. This cannot be undone. Defaults to `false`.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.deleteWorkItem({
      $,
      organization: this.organization,
      project: this.project,
      workItemId: this.workItemId,
      params: {
        destroy: this.destroy,
      },
    });
    $.export("$summary", this.destroy
      ? `Permanently deleted work item ${this.workItemId}`
      : `Moved work item ${this.workItemId} to the recycle bin`);
    return response;
  },
};
