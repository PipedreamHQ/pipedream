// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-repository",
  name: "Get Repository",
  description: "Retrieve one Git repository by id or name. Returns its default branch, size, web url and parent project. Use this to confirm a repository's default branch before opening a pull request against it. Example: `fabrikam-api`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/repositories/get-repository?view=azure-devops-rest-7.1)",
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
    repositoryId: {
      propDefinition: [
        azureDevops,
        "repositoryId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getRepository({
      $,
      organization: this.organization,
      project: this.project,
      repositoryId: this.repositoryId,
    });
    $.export("$summary", `Retrieved repository ${response.id}: ${response.name}`);
    return response;
  },
};
