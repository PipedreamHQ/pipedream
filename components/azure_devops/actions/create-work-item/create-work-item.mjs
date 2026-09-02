// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import { PATCH_OP } from "../../common/constants.mjs";
import {
  buildFieldPatchDocument, compactFields, parseObject,
} from "../../common/utils.mjs";

export default {
  key: "azure_devops-create-work-item",
  name: "Create Work Item",
  description: "Create a work item of any type - Bug, Task, User Story, Epic. Returns the new work item's id and full field set. Use when turning an alert, form submission or support ticket into tracked work. Example: type `Bug`, title `Checkout returns 500 on empty cart`, assigned to `jamal@fabrikam.com`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/create?view=azure-devops-rest-7.1)",
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
    workItemType: {
      propDefinition: [
        azureDevops,
        "workItemType",
      ],
    },
    title: {
      propDefinition: [
        azureDevops,
        "workItemTitle",
      ],
    },
    description: {
      propDefinition: [
        azureDevops,
        "workItemDescription",
      ],
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
      "System.AssignedTo": this.assignedTo,
      "System.AreaPath": this.areaPath,
      "System.IterationPath": this.iterationPath,
      "System.Tags": this.tags?.length
        ? this.tags.join("; ")
        : undefined,
      ...parseObject(this.additionalFields, "Additional Fields"),
    });

    const response = await this.azureDevops.createWorkItem({
      $,
      organization: this.organization,
      project: this.project,
      workItemType: this.workItemType,
      params: {
        $expand: this.expand,
        bypassRules: this.bypassRules,
        suppressNotifications: this.suppressNotifications,
        validateOnly: this.validateOnly,
      },
      data: buildFieldPatchDocument(fields, PATCH_OP.ADD),
    });
    $.export("$summary", `Created ${this.workItemType} ${response.id}: ${this.title}`);
    return response;
  },
};
