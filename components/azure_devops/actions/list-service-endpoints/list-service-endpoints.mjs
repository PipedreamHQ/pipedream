import azureDevops from "../../azure_devops.app.mjs";
import { SERVICE_ENDPOINT_ACTION_FILTER_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-list-service-endpoints",
  name: "List Service Endpoints",
  description: "List a project's service connections, optionally filtered by type. Returns each connection's id, name, type and authorization scheme, without its secrets. Use this to audit which external systems a project can reach from its pipelines. Example: type `github` returns the GitHub connection and its id. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/serviceendpoint/endpoints/get-service-endpoints?view=azure-devops-rest-7.1)",
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
    endpointIds: {
      type: "string[]",
      label: "Endpoint IDs",
      description: "Only return the service connections with these GUIDs, e.g. `[\"5e2c1a9f-3b7d-4c88-9f21-6a0b8d4e7c13\"]`. The values are the `id` field of a service endpoint returned by this action.",
      optional: true,
    },
    owner: {
      type: "string",
      label: "Owner",
      description: "Only return service connections with this owner, e.g. `library`",
      optional: true,
    },
    authSchemes: {
      type: "string[]",
      label: "Auth Schemes",
      description: "Only return service connections using these authorization schemes, e.g. `UsernamePassword`, `Token`",
      optional: true,
    },
    actionFilter: {
      type: "string",
      label: "Action Filter",
      description: "Only return service connections the caller holds this permission on",
      options: SERVICE_ENDPOINT_ACTION_FILTER_OPTIONS,
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
        owner: this.owner,
        actionFilter: this.actionFilter,
        endpointIds: this.endpointIds?.length
          ? this.endpointIds.join(",")
          : undefined,
        authSchemes: this.authSchemes?.length
          ? this.authSchemes.join(",")
          : undefined,
      },
    });
    $.export("$summary", `Found ${endpoints.length} service endpoint${endpoints.length === 1
      ? ""
      : "s"} in project ${this.project}`);
    return endpoints;
  },
};
