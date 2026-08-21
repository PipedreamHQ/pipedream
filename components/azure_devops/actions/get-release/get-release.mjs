// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import {
  RELEASE_APPROVAL_FILTER_OPTIONS, RELEASE_EXPAND_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "azure_devops-get-release",
  name: "Get Release",
  description: "Retrieve one classic release. Returns its environments, each environment's deployment status, and the artifacts it carries. Use this to check whether a release reached production. Example: release `27`. Run the **List Releases** action first to obtain the release id. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/release/releases/get-release?view=azure-devops-rest-7.1)",
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
    releaseId: {
      propDefinition: [
        azureDevops,
        "releaseId",
      ],
    },
    expand: {
      type: "string",
      label: "Expand",
      description: "Extra detail to expand in the release. `tasks` includes each deployment's task records.",
      options: RELEASE_EXPAND_OPTIONS,
      optional: true,
    },
    approvalFilters: {
      type: "string",
      label: "Approval Filters",
      description: "Which approval steps and approval snapshots to include. Defaults to `all`.",
      options: RELEASE_APPROVAL_FILTER_OPTIONS,
      optional: true,
    },
    propertyFilters: {
      type: "string[]",
      label: "Property Filters",
      description: "Extended property names to return values for, one per array item, e.g. `[\"releaseNotes\", \"approvedBy\"]`. These are the custom property keys stored against the release by whoever created it; the release object returns none unless named here. Omit to exclude extended properties entirely.",
      optional: true,
    },
    topGateRecords: {
      type: "integer",
      label: "Top Gate Records",
      description: "Number of release gate records to return (defaults to 5)",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getRelease({
      $,
      organization: this.organization,
      project: this.project,
      releaseId: this.releaseId,
      params: {
        $expand: this.expand,
        $topGateRecords: this.topGateRecords,
        approvalFilters: this.approvalFilters,
        propertyFilters: this.propertyFilters?.length
          ? this.propertyFilters.join(",")
          : undefined,
      },
    });
    $.export("$summary", `Retrieved release ${response.id}: ${response.name}`);
    return response;
  },
};
