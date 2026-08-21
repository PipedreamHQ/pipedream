// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-repositories",
  name: "List Repositories",
  description: "List the Git repositories in a project, or across the whole organization when no project is given. Returns each repository's id, name, default branch and size. Use this to obtain the repository id or name every other Git action needs. Example: project `Fabrikam-Fiber-Git` returns `fabrikam-api` and its GUID. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/repositories/list?view=azure-devops-rest-7.1)",
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
      description: "Project ID or project name. Run the **List Projects** action first to obtain valid values. Omit to list every repository in the organization.",
      optional: true,
    },
    includeLinks: {
      propDefinition: [
        azureDevops,
        "includeLinks",
      ],
      description: "Include reference links for each repository",
    },
    includeHidden: {
      type: "boolean",
      label: "Include Hidden",
      description: "Include repositories that are hidden, such as the ones backing project wikis",
      optional: true,
    },
  },
  async run({ $ }) {
    const { value: repositories } = await this.azureDevops.listRepositories({
      $,
      organization: this.organization,
      project: this.project,
      params: {
        includeLinks: this.includeLinks,
        includeHidden: this.includeHidden,
      },
    });
    $.export("$summary", `Found ${repositories.length} repositor${repositories.length === 1
      ? "y"
      : "ies"}`);
    return repositories;
  },
};
