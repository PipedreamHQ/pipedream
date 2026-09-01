// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-delete-repository",
  name: "Delete Repository",
  description: "Move a Git repository to the project's recycle bin. Requires the repository's GUID - names are not accepted here. Use this to retire a service's repository; recover it from the project settings recycle bin if this was a mistake. Example: repository `2f3d611a-f012-4b39-b157-8db63f380226`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/repositories/delete?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
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
    repositoryId: {
      propDefinition: [
        azureDevops,
        "repositoryId",
      ],
      description: "ID of the repository to delete. The repository ID is required here - names are not accepted. Run the **List Repositories** action first to obtain valid values.",
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.deleteRepository({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
    });
    $.export("$summary", `Deleted repository ${this.repositoryId}`);
    return response;
  },
};
