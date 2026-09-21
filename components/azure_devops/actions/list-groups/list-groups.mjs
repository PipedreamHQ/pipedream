import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-groups",
  name: "List Groups",
  description: "List the groups in an organization, optionally scoped to one project or collection. Returns each group's display name, descriptor and principal name. Use this to find the group to add as a required pull request reviewer. Example: returns `[Fabrikam-Fiber-Git]\\\\Contributors`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/graph/groups/list?view=azure-devops-rest-7.1)",
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
    scopeDescriptor: {
      type: "string",
      label: "Scope Descriptor",
      description: "Opaque Graph descriptor of a project or collection to scope the search to, e.g. `scp.MjQ4OWFiZDMtMzc4NC00YTU2LWEwNGItYzY2NmE4NmQ1MzYx`. Obtain it from the Azure DevOps Graph descriptors endpoint, `GET https://vssps.dev.azure.com/{organization}/_apis/graph/descriptors/{projectId}`. Omit to list organization-wide groups.",
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of groups to return (1-1000)",
    },
  },
  async run({ $ }) {
    const groups = await this.azureDevops.paginate({
      limit: this.limit,
      fetchPage: ({ continuationToken }) => this.azureDevops.listGraphGroups({
        $,
        organization: this.organization,
        params: {
          scopeDescriptor: this.scopeDescriptor,
          continuationToken,
        },
        returnFullResponse: true,
      }),
    });
    $.export("$summary", `Found ${groups.length} group${groups.length === 1
      ? ""
      : "s"} in ${this.organization}`);
    return groups;
  },
};
