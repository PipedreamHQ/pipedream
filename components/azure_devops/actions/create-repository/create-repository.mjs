// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-create-repository",
  name: "Create Repository",
  description: "Create an empty Git repository in a project. Returns the new repository's id, name and clone urls. The repository starts with no branches - push an initial commit before the other Git actions can act on it. Use when scaffolding a new service. Example: name `fabrikam-payments` in project `Fabrikam-Fiber-Git`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/repositories/create?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
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
    repositoryName: {
      type: "string",
      label: "Repository Name",
      description: "Name of the new repository (max 64 chars)",
    },
  },
  async run({ $ }) {
    const project = await this.azureDevops.getProject({
      $,
      organization: this.organization,
      projectId: this.project,
    });
    const response = await this.azureDevops.createRepository({
      $,
      organization: this.organization,
      project: this.project,
      data: {
        name: this.repositoryName,
        project: {
          id: project.id,
        },
      },
    });
    $.export("$summary", `Created repository ${response.id}: ${response.name}`);
    return response;
  },
};
