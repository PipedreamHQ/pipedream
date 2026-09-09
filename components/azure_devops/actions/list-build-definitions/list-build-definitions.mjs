import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-build-definitions",
  name: "List Build Definitions",
  description: "List a project's build definitions. Returns each definition's id, name, repository and queue status. Use this to obtain the definition id the **Queue Build** action needs. Example: project `Fabrikam-Fiber-Git` returns `fabrikam-api-CI` with id `12`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/build/definitions/list?view=azure-devops-rest-7.1)",
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
    name: {
      type: "string",
      label: "Name Filter",
      description: "Return only definitions whose name matches this value. Append `*` for a prefix search.",
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
      }) => this.azureDevops.listBuildDefinitions({
        $,
        organization: this.organization,
        project: this.project,
        params: {
          name: this.name,
          $top: top,
          continuationToken,
        },
        returnFullResponse: true,
      }),
    });
    $.export("$summary", `Found ${definitions.length} build definition${definitions.length === 1
      ? ""
      : "s"} in project ${this.project}`);
    return definitions;
  },
};
