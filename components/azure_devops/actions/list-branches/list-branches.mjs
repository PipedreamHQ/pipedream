// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-branches",
  name: "List Branches And Tags",
  description: "List the refs - branches and tags - of a Git repository, each with the commit it points at. Use this to obtain the fully qualified branch names the pull request and build actions expect, and to read a branch's head SHA. Example: filter `heads/` returns `refs/heads/main` at `a3fecf65...`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/refs/list?view=azure-devops-rest-7.1)",
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
    repositoryId: {
      propDefinition: [
        azureDevops,
        "repositoryId",
      ],
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Return only refs whose name starts with this value, e.g. `heads/` for branches or `tags/` for tags",
      optional: true,
    },
    filterContains: {
      type: "string",
      label: "Filter Contains",
      description: "Return only refs whose name contains this value",
      optional: true,
    },
    includeLinks: {
      propDefinition: [
        azureDevops,
        "includeLinks",
      ],
      description: "Include reference links for each ref",
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of refs to return (1-1000)",
    },
  },
  async run({ $ }) {
    const refs = await this.azureDevops.paginate({
      limit: this.limit,
      fetchPage: ({
        continuationToken, top,
      }) => this.azureDevops.listRefs({
        $,
        organization: this.organization,
        project: this.project,
        repositoryId: this.repositoryId,
        params: {
          filter: this.filter,
          filterContains: this.filterContains,
          includeLinks: this.includeLinks,
          $top: top,
          continuationToken,
        },
        returnFullResponse: true,
      }),
    });
    $.export("$summary", `Found ${refs.length} ref${refs.length === 1
      ? ""
      : "s"} in repository ${this.repositoryId}`);
    return refs;
  },
};
