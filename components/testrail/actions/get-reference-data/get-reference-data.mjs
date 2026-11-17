import app from "../../testrail.app.mjs";

const TYPES = {
  statuses: "get_statuses",
  case_fields: "get_case_fields",
  result_fields: "get_result_fields",
  case_types: "get_case_types",
  priorities: "get_priorities",
  templates: "get_templates",
};

export default {
  key: "testrail-get-reference-data",
  name: "Get Reference Data",
  description: "Looks up TestRail's configurable reference lists: statuses, case types, priorities, case templates and the custom-field definitions for cases and results. Use it before writing, to get the valid numeric IDs (for example the status ID that means Failed) and the exact custom field names such as `custom_steps_separated`. Not for listing projects, suites or users (use **List Projects**, **Get Project**, **List Users**). Returns the list for the chosen `referenceType`; case_fields and result_fields return each field's system_name, type and whether it is active. Example: referenceType=\"statuses\" → id/name/label per status (default 5 = Failed). [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    referenceType: {
      type: "string",
      label: "Type",
      description: "Which reference list to return.",
      options: Object.keys(TYPES),
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
      description: "Required only when `referenceType` is `templates`: the project ID or exact name. Ignored for other types.",
      optional: true,
    },
  },
  async run({ $ }) {
    let path = TYPES[this.referenceType];
    if (this.referenceType === "templates") {
      if (!this.projectId) throw new Error("projectId is required when referenceType is templates");
      path += `/${await this.app.resolveProjectId($, this.projectId)}`;
    }
    const response = await this.app.get({
      $,
      path,
    });
    let items = this.app.unwrap(response, this.referenceType);
    if (!Array.isArray(items)) items = Object.values(response ?? {});
    if (this.referenceType === "case_fields" || this.referenceType === "result_fields") {
      items = items.map(({
        id, system_name, label, type_id, is_active, description,
      }) => ({
        id,
        system_name,
        label,
        type_id,
        is_active,
        description,
      }));
    }
    $.export("$summary", `Found ${items.length} ${this.referenceType}`);
    return items;
  },
};
