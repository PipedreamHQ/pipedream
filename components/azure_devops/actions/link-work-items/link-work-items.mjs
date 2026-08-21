// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import {
  BASE_URL, PATCH_OP, WORK_ITEM_LINK_TYPE_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "azure_devops-link-work-items",
  name: "Link Work Items",
  description: "Create a link between two work items - parent, child, related, duplicate, predecessor or successor. Returns the updated source work item including its relations. Use this to attach a new bug to its epic, or to mark one item as a duplicate of another. Example: link work item `310` to `299` as `Child`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/update?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
      description: "Numeric ID of the work item the link is added to. Run the **Query Work Items (WIQL)** action first to obtain valid values.",
    },
    targetWorkItemId: {
      propDefinition: [
        azureDevops,
        "workItemId",
      ],
      label: "Target Work Item ID",
      description: "Numeric ID of the work item to link to. Run the **Query Work Items (WIQL)** action first to obtain work item ids.",
    },
    linkType: {
      type: "string",
      label: "Link Type",
      description: "Relationship the target work item has to the source work item",
      options: WORK_ITEM_LINK_TYPE_OPTIONS,
    },
    comment: {
      propDefinition: [
        azureDevops,
        "commentText",
      ],
      label: "Link Comment",
      description: "Comment describing why the work items are linked",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.updateWorkItem({
      $,
      organization: this.organization,
      project: this.project,
      workItemId: this.workItemId,
      data: [
        {
          op: PATCH_OP.ADD,
          path: "/relations/-",
          value: {
            rel: this.linkType,
            url: `${BASE_URL}/${this.organization}/_apis/wit/workItems/${this.targetWorkItemId}`,
            attributes: {
              comment: this.comment,
            },
          },
        },
      ],
    });
    $.export("$summary", `Linked work item ${this.targetWorkItemId} to ${this.workItemId} as ${this.linkType}`);
    return response;
  },
};
