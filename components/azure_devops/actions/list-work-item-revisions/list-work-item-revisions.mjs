// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-work-item-revisions",
  name: "List Work Item Revisions",
  description: "List the revision history of a work item, one entry per change. Returns each revision's field values at that point in time. Use this to answer who changed what and when, or to reconstruct how long an item sat in a state. Example: work item `299`. Returns at most **Limit** results per call - if that many come back there may be more, so raise **Skip** by **Limit** and call again to page through the rest. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/revisions/list?view=azure-devops-rest-7.1)",
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
    workItemId: {
      propDefinition: [
        azureDevops,
        "workItemId",
      ],
    },
    expand: {
      propDefinition: [
        azureDevops,
        "workItemExpand",
      ],
      description: "Additional work item attributes to include in each revision",
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of revisions to return (1-1000)",
    },
    skip: {
      propDefinition: [
        azureDevops,
        "skip",
      ],
    },
  },
  async run({ $ }) {
    const { value: revisions } = await this.azureDevops.listWorkItemRevisions({
      $,
      organization: this.organization,
      project: this.project,
      workItemId: this.workItemId,
      params: {
        $expand: this.expand,
        $top: this.limit,
        $skip: this.skip,
      },
    });
    $.export("$summary", `Found ${revisions.length} revision${revisions.length === 1
      ? ""
      : "s"} for work item ${this.workItemId}`);
    return revisions;
  },
};
