import app from "../../testrail.app.mjs";

const RESOURCES = {
  suites: {
    path: (projectId) => `get_suites/${projectId}`,
    needsProject: true,
    key: "suites",
  },
  statuses: {
    path: () => "get_statuses",
    key: "statuses",
  },
  case_fields: {
    path: () => "get_case_fields",
    key: "case_fields",
  },
  result_fields: {
    path: () => "get_result_fields",
    key: "result_fields",
  },
  case_types: {
    path: () => "get_case_types",
    key: "case_types",
  },
  priorities: {
    path: () => "get_priorities",
    key: "priorities",
  },
  templates: {
    path: (projectId) => `get_templates/${projectId}`,
    needsProject: true,
    key: "templates",
  },
};

const FIELD_TYPES = {
  1: "String",
  2: "Integer",
  3: "Text",
  4: "URL",
  5: "Checkbox",
  6: "Dropdown",
  7: "User",
  8: "Date",
  9: "Milestone",
  10: "Steps",
  11: "Step Results",
  12: "Multi-select",
};

// Case/result field definitions are large (config blobs per project). Return the
// parts a caller needs to fill the field in correctly.
function compactField(field) {
  const options = field.configs?.[0]?.options ?? {};
  return {
    id: field.id,
    system_name: field.system_name,
    label: field.label,
    type: FIELD_TYPES[field.type_id] ?? field.type_id,
    is_required: Boolean(options.is_required),
    default_value: options.default_value || undefined,
    items: options.items || undefined,
  };
}

export default {
  key: "testrail-get-metadata",
  name: "Get Metadata",
  description: "Look up TestRail reference data that other tools need as input. Pick one `resource`: `suites` (a project's suites; needs projectId; use before **List Cases** or **List Sections** on multi-suite projects), `statuses` (result status IDs and labels: by default 1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed, but instances can add custom ones; use before **Add Result** or filtering **List Tests**), `case_fields` (custom fields for test cases with their `custom_*` system names, types, dropdown items and whether they are required; use before **Add Case**), `result_fields` (same for results; use before **Add Result** with customFields), `case_types`, `priorities`, `templates` (needs projectId; template IDs for **Add Case**). Example: to learn which status ID means Failed, call with resource=statuses → returns each status with id, name, label, is_final, is_untested. Common mistake: hard-coding status IDs instead of checking, since custom statuses change the numbering. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    resource: {
      type: "string",
      label: "Resource",
      description: "Which reference data to list: `suites`, `statuses`, `case_fields`, `result_fields`, `case_types`, `priorities` or `templates`.",
      options: Object.keys(RESOURCES),
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
      description: "Required for `suites` and `templates`; ignored otherwise. Use **List Projects** to find it.",
      optional: true,
    },
  },
  async run({ $ }) {
    const resource = RESOURCES[this.resource];
    if (!resource) {
      throw new Error(`Unknown resource "${this.resource}". Use one of: ${Object.keys(RESOURCES).join(", ")}`);
    }
    if (resource.needsProject && !this.projectId) {
      throw new Error(`projectId is required for resource "${this.resource}". Use List Projects to find it.`);
    }
    const response = await this.app._makeRequest({
      $,
      path: resource.path(this.projectId),
    });
    let items = this.app.itemsOf(response, resource.key);
    if (this.resource === "case_fields" || this.resource === "result_fields") {
      items = items.filter((field) => field.is_active !== false).map(compactField);
    }
    $.export("$summary", `Retrieved ${items.length} ${this.resource.replace("_", " ")}`);
    return {
      [this.resource]: items,
    };
  },
};
