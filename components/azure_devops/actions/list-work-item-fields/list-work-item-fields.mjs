import azureDevops from "../../azure_devops.app.mjs";
import { WORK_ITEM_FIELD_EXPAND_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-list-work-item-fields",
  name: "List Work Item Fields",
  description: "List the work item fields defined in an organization or project, with each field's reference name and data type. Use this to discover the reference names the **Additional Fields** and **Fields** inputs of the other work item actions expect. Example: returns `Microsoft.VSTS.Common.Priority` for the field shown as Priority in the UI. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/fields/list?view=azure-devops-rest-7.1)",
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
      optional: true,
    },
    expand: {
      type: "string",
      label: "Expand",
      description: "Extra field categories to include. `extensionFields` adds fields contributed by extensions, `includeDeleted` adds fields that have been deleted.",
      options: WORK_ITEM_FIELD_EXPAND_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const { value: fields } = await this.azureDevops.listWorkItemFields({
      $,
      organization: this.organization,
      project: this.project,
      params: {
        $expand: this.expand,
      },
    });
    $.export("$summary", `Found ${fields.length} work item field${fields.length === 1
      ? ""
      : "s"}`);
    return fields;
  },
};
