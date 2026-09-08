import azureDevops from "../../azure_devops.app.mjs";
import { RELEASE_STATUS_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-list-releases",
  name: "List Releases",
  description: "List a project's classic releases, optionally filtered by definition or status. Returns each release's id, name, status and the definition it came from. Use this to report on what has shipped. Example: definition `3`, status `active`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/release/releases/list?view=azure-devops-rest-7.1)",
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
        "releaseDefinitionId",
      ],
      description: "Only return releases created from this release definition. Run the **List Release Definitions** action first to obtain valid values.",
      optional: true,
    },
    statusFilter: {
      type: "string",
      label: "Status",
      description: "Only return releases in this status",
      options: RELEASE_STATUS_OPTIONS,
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of releases to return (1-1000)",
    },
  },
  async run({ $ }) {
    const releases = await this.azureDevops.paginate({
      limit: this.limit,
      fetchPage: ({
        continuationToken, top,
      }) => this.azureDevops.listReleases({
        $,
        organization: this.organization,
        project: this.project,
        params: {
          definitionId: this.definitionId,
          statusFilter: this.statusFilter,
          $top: top,
          continuationToken,
        },
        returnFullResponse: true,
      }),
    });
    $.export("$summary", `Found ${releases.length} release${releases.length === 1
      ? ""
      : "s"} in project ${this.project}`);
    return releases;
  },
};
