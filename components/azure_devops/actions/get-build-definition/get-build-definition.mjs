import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-build-definition",
  name: "Get Build Definition",
  description: "Retrieve one build definition, including its repository, triggers, variables and process. Use this to inspect what a pipeline will do, or to read its variable names before overriding them at queue time. Example: definition `12`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/build/definitions/get?view=azure-devops-rest-7.1)",
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
    definitionId: {
      propDefinition: [
        azureDevops,
        "buildDefinitionId",
      ],
    },
    revision: {
      type: "integer",
      label: "Revision",
      description: "Return this specific revision of the definition. Defaults to the latest.",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getBuildDefinition({
      $,
      organization: this.organization,
      project: this.project,
      definitionId: this.definitionId,
      params: {
        revision: this.revision,
      },
    });
    $.export("$summary", `Retrieved build definition ${response.id}: ${response.name}`);
    return response;
  },
};
