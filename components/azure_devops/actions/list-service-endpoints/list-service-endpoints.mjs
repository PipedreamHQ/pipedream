// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-service-endpoints",
  name: "List Service Endpoints",
  description: "List a project's service connections, optionally filtered by type. Returns each connection's id, name, type and authorization scheme, without its secrets. Use this to audit which external systems a project can reach from its pipelines. Example: type `github` returns the GitHub connection and its id. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/serviceendpoint/endpoints/get-service-endpoints?view=azure-devops-rest-7.1)",
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
    type: {
      type: "string",
      label: "Type",
      description: "Only return service connections of this type, e.g. `github`, `azurerm`, `dockerregistry`",
      optional: true,
    },
    includeFailed: {
      type: "boolean",
      label: "Include Failed",
      description: "Include service connections that are in a failed state",
      optional: true,
    },
  },
  async run({ $ }) {
    const { value: endpoints } = await this.azureDevops.listServiceEndpoints({
      $,
      organization: this.organization,
      project: this.project,
      params: {
        type: this.type,
        includeFailed: this.includeFailed,
      },
    });
    $.export("$summary", `Found ${endpoints.length} service endpoint${endpoints.length === 1
      ? ""
      : "s"} in project ${this.project}`);
    return endpoints;
  },
};
