// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import azureDevops from "../../azure_devops.app.mjs";
import { PATCH_OP } from "../../common/constants.mjs";
import {
  buildFieldPatchDocument, compactFields, parseObject,
} from "../../common/utils.mjs";

export default {
  key: "azure_devops-update-work-item",
  name: "Update Work Item",
  description: "Update the fields of an existing work item - retitle it, move it between states, reassign it or repoint its area and iteration. At least one field is required. Returns the updated work item. Use when closing out automated work or reflecting a change from another system. Example: work item `299`, state `Closed`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/update?view=azure-devops-rest-7.1)",
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
    if (!fieldNames.length) {
      throw new ConfigurationError("Provide at least one field to update.");
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
      data: buildFieldPatchDocument(fields, PATCH_OP.REPLACE),
    });
    $.export("$summary", `Updated work item ${response.id}: set ${fieldNames.join(", ")}`);
    return response;
  },
};
