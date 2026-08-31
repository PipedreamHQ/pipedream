// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-work-item",
  name: "Get Work Item",
  description: "Retrieve one work item by id. Returns its fields, and optionally its relations and links via **Expand**. Use this to read the current state of an item before deciding whether to update it. Example: work item `299`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/get-work-item?view=azure-devops-rest-7.1)",
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
    fields: {
      propDefinition: [
        azureDevops,
        "workItemFields",
      ],
      optional: true,
    },
    expand: {
      propDefinition: [
        azureDevops,
        "workItemExpand",
      ],
      optional: true,
    },
    asOf: {
      propDefinition: [
        azureDevops,
        "asOf",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getWorkItem({
      $,
      organization: this.organization,
      project: this.project,
      workItemId: this.workItemId,
      params: {
        fields: this.fields?.length
          ? this.fields.join(",")
          : undefined,
        $expand: this.expand,
        asOf: this.asOf,
      },
    });
    $.export("$summary", `Retrieved work item ${response.id}: ${response.fields?.["System.Title"] ?? ""}`);
    return response;
  },
};
