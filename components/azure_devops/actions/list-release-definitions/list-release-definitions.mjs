import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-release-definitions",
  name: "List Release Definitions",
  description: "List a project's classic release definitions. Returns each definition's id, name and path. Use this to obtain the definition id the **Create Release** action needs. Classic Release is separate from YAML pipelines. Example: project `Fabrikam-Fiber-Git` returns `fabrikam-api-CD` with id `3`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/release/definitions/list?view=azure-devops-rest-7.1)",
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
    searchText: {
      type: "string",
      label: "Search Text",
      description: "Return only definitions whose name contains this value",
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of definitions to return (1-1000)",
    },
  },
  async run({ $ }) {
    const definitions = await this.azureDevops.paginate({
      limit: this.limit,
      fetchPage: ({
        continuationToken, top,
      }) => this.azureDevops.listReleaseDefinitions({
        $,
        organization: this.organization,
        project: this.project,
        params: {
          searchText: this.searchText,
          $top: top,
          continuationToken,
        },
        returnFullResponse: true,
      }),
    });
    $.export("$summary", `Found ${definitions.length} release definition${definitions.length === 1
      ? ""
      : "s"} in project ${this.project}`);
    return definitions;
  },
};
