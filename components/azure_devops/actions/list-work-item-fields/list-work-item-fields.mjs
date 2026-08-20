// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-list-work-item-fields",
  name: "List Work Item Fields",
  description: "List the work item fields defined in an organization or project, with each field's reference name and data type. Use this to discover the reference names the **Additional Fields** and **Fields** inputs of the other work item actions expect. Example: returns `Microsoft.VSTS.Common.Priority` for the field shown as Priority in the UI. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/fields/list?view=azure-devops-rest-7.1)",
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
      optional: true,
    },
  },
  async run({ $ }) {
    const { value: fields } = await this.azureDevops.listWorkItemFields({
      $,
      organization: this.organization,
      project: this.project,
    });
    $.export("$summary", `Found ${fields.length} work item field${fields.length === 1
      ? ""
      : "s"}`);
    return fields;
  },
};
