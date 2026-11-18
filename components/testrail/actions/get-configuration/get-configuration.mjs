import app from "../../testrail.app.mjs";

const GROUPS = [
  "statuses",
  "priorities",
  "case_types",
  "templates",
  "case_fields",
  "result_fields",
];

export default {
  key: "testrail-get-configuration",
  name: "Get Configuration",
  description: "Get the instance's lookup values: result statuses, case priorities, case types, case templates, and the custom fields for cases and results. Use it when the user asks what result statuses, priorities, case types or custom fields exist, and before writing, to learn valid status names, priority names and the `custom_*` field names that Create Case, Update Case and Add Result accept in `customFields`. To read actual cases, use **List Cases**; to read results, use **Get Results**. Returns only the groups you ask for (statuses, priorities and case types by default); custom fields come back trimmed to system_name, label, type, is_required and dropdown items. Example: include=[\"statuses\", \"case_fields\"] → statuses like {id: 5, label: \"Failed\"} plus fields like {system_name: \"custom_steps_separated\", type: \"steps\"}. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    include: {
      type: "string[]",
      label: "Include",
      description: "Which groups to return. Defaults to `statuses`, `priorities` and `case_types`. Add `case_fields` for the custom fields you can set on a case, `result_fields` for those on a result, and `templates` (needs Project ID) for case templates.",
      options: GROUPS,
      optional: true,
    },
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The numeric project ID, e.g. `4`. Only needed when `include` contains `templates`. Use **List Projects** to find it.",
      optional: true,
    },
  },
  async run({ $ }) {
    const include = this.include?.length
      ? this.include
      : [
        "statuses",
        "priorities",
        "case_types",
      ];
    if (include.includes("templates") && !this.projectId) {
      throw new Error("projectId is required to include templates. Use List Projects to find it.");
    }
    const endpoints = {
      statuses: "get_statuses",
      priorities: "get_priorities",
      case_types: "get_case_types",
      templates: `get_templates/${this.projectId}`,
      case_fields: "get_case_fields",
      result_fields: "get_result_fields",
    };
    const entries = await Promise.all(include.map(async (group) => {
      const data = await this.app._makeRequest({
        $,
        endpoint: endpoints[group],
      });
      const list = Array.isArray(data)
        ? data
        : data.templates || [];
      if (group === "statuses") {
        return [
          group,
          list.map((s) => ({
            id: s.id,
            name: s.name,
            label: s.label,
            is_final: s.is_final,
            is_untested: s.is_untested,
          })),
        ];
      }
      if (group === "case_fields" || group === "result_fields") {
        return [
          group,
          list.filter((f) => f.is_active !== false).map((f) => this.app.describeField(f)),
        ];
      }
      return [
        group,
        list,
      ];
    }));
    $.export("$summary", `Fetched ${include.join(", ")}`);
    return Object.fromEntries(entries);
  },
};
