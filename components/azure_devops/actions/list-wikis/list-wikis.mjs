import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-wikis",
  name: "List Wikis",
  description: "List the wikis in a project, or across the organization when no project is given. Returns each wiki's id, name, type and backing repository. Use this to obtain the wiki id or name the wiki page actions need. Example: project `Fabrikam-Fiber-Git` returns `Fabrikam-Fiber-Git.wiki`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wiki/wikis/list?view=azure-devops-rest-7.1)",
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
      description: "Project ID or project name. Run the **List Projects** action first to obtain valid values. Omit to list every wiki in the organization.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { value: wikis } = await this.azureDevops.listWikis({
      $,
      organization: this.organization,
      project: this.project,
    });
    $.export("$summary", `Found ${wikis.length} wiki${wikis.length === 1
      ? ""
      : "s"}`);
    return wikis;
  },
};
