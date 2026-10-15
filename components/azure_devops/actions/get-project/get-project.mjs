import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-project",
  name: "Get Project",
  description: "Retrieve one project by id or name. Returns its description, state, visibility, default team and, when **Include Capabilities** is set, its version-control and process-template settings. Use this to confirm a project exists before writing to it. Example: `Fabrikam-Fiber-Git`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/core/projects/get?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    includeCapabilities: {
      type: "boolean",
      label: "Include Capabilities",
      description: "Include the project's version control and process template capabilities in the response.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getProject({
      $,
      organization: this.organization,
      projectId: this.project,
      params: {
        includeCapabilities: this.includeCapabilities,
      },
    });
    $.export("$summary", `Retrieved project ${response.id}: ${response.name}`);
    return response;
  },
};
