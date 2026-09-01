// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import azureDevops from "../../azure_devops.app.mjs";
import {
  BASE_URL, PATCH_OP, WORK_ITEM_LINK_TYPE_OPTIONS,
} from "../../common/constants.mjs";
import {
  buildFieldPatchDocument, compactFields, parseObject,
} from "../../common/utils.mjs";

export default {
  key: "azure_devops-update-work-item",
  name: "Update Work Item",
  description: "Update an existing work item - retitle it, move it between states, reassign it, repoint its area and iteration, or link it to another work item. At least one field or a link is required. Returns the updated work item. Use when closing out automated work or reflecting a change from another system. Example: work item `299`, state `Closed`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/update?view=azure-devops-rest-7.1)",
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
    },
    title: {
      propDefinition: [
        azureDevops,
        "workItemTitle",
      ],
      description: "New title of the work item (max 255 chars)",
      optional: true,
    },
    description: {
      propDefinition: [
        azureDevops,
        "workItemDescription",
      ],
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "New state, e.g. `Active`, `Resolved`, `Closed`. Valid values depend on the work item type - run the **List Work Item Types** action first.",
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        azureDevops,
        "assignedTo",
      ],
      optional: true,
    },
    areaPath: {
      propDefinition: [
        azureDevops,
        "areaPath",
      ],
      optional: true,
    },
    iterationPath: {
      propDefinition: [
        azureDevops,
        "iterationPath",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        azureDevops,
        "tags",
      ],
      description: "Tags to set on the work item. Replaces the existing tag list.",
      optional: true,
    },
    additionalFields: {
      propDefinition: [
        azureDevops,
        "additionalFields",
      ],
      optional: true,
    },
    targetWorkItemId: {
      propDefinition: [
        azureDevops,
        "workItemId",
      ],
      label: "Link Target Work Item ID",
      description: "Numeric ID of a work item to link this one to, e.g. `297`. Run the **Query Work Items (WIQL)** action first to obtain valid values. Requires **Link Type**.",
      optional: true,
    },
    linkType: {
      type: "string",
      label: "Link Type",
      description: "Relationship the target work item has to this one, e.g. a predecessor it depends on. Requires **Link Target Work Item ID**.",
      options: WORK_ITEM_LINK_TYPE_OPTIONS,
      optional: true,
    },
    linkComment: {
      propDefinition: [
        azureDevops,
        "commentText",
      ],
      label: "Link Comment",
      description: "Comment describing why the work items are linked",
      optional: true,
    },
    expand: {
      propDefinition: [
        azureDevops,
        "workItemExpand",
      ],
      description: "Additional work item attributes to include in the response",
      optional: true,
    },
    bypassRules: {
      propDefinition: [
        azureDevops,
        "bypassRules",
      ],
      optional: true,
    },
    suppressNotifications: {
      propDefinition: [
        azureDevops,
        "suppressNotifications",
      ],
      optional: true,
    },
    validateOnly: {
      propDefinition: [
        azureDevops,
        "validateOnly",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const fields = compactFields({
      "System.Title": this.title,
      "System.Description": this.description,
      "System.State": this.state,
      "System.AssignedTo": this.assignedTo,
      "System.AreaPath": this.areaPath,
      "System.IterationPath": this.iterationPath,
      "System.Tags": this.tags?.length
        ? this.tags.join("; ")
        : undefined,
      ...parseObject(this.additionalFields, "Additional Fields"),
    });
    const fieldNames = Object.keys(fields);
    const linking = Boolean(this.targetWorkItemId || this.linkType);
    if (linking && !(this.targetWorkItemId && this.linkType)) {
      throw new ConfigurationError("**Link Target Work Item ID** and **Link Type** must be provided together.");
    }
    if (!fieldNames.length && !linking) {
      throw new ConfigurationError("Provide at least one field to update, or a work item to link to.");
    }

    const operations = buildFieldPatchDocument(fields, PATCH_OP.REPLACE);
    if (linking) {
      operations.push({
        op: PATCH_OP.ADD,
        path: "/relations/-",
        value: {
          rel: this.linkType,
          url: `${BASE_URL}/${this.organization}/_apis/wit/workItems/${this.targetWorkItemId}`,
          attributes: {
            comment: this.linkComment,
          },
        },
      });
    }

    const response = await this.azureDevops.updateWorkItem({
      $,
      organization: this.organization,
      project: this.project,
      workItemId: this.workItemId,
      params: {
        $expand: this.expand,
        bypassRules: this.bypassRules,
        suppressNotifications: this.suppressNotifications,
        validateOnly: this.validateOnly,
      },
      data: operations,
    });
    const changes = fieldNames.slice();
    if (linking) {
      changes.push(`linked ${this.targetWorkItemId} as ${this.linkType}`);
    }
    $.export("$summary", `Updated work item ${response.id}: ${changes.join(", ")}`);
    return response;
  },
};
