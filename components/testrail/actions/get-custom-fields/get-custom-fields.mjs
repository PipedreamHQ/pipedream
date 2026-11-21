import app from "../../testrail.app.mjs";

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
  13: "Scenario",
};

export default {
  key: "testrail-get-custom-fields",
  name: "Get Custom Fields",
  description: "Gets the custom fields defined on test cases or on test results in TestRail. Use it before **Create Case** to learn the field names for steps and expected results (such as `custom_steps_separated` or `custom_preconds`) and which fields are required, or before **Add Result** to see extra result fields. Not for statuses: use **Get Statuses**. Returns each active field's system_name (the key to send in `customFields`), label, type, is_required, default_value and, for dropdowns, the allowed items with their numeric IDs. Example: fieldType=\"case\" → `[{system_name: \"custom_steps_separated\", type: \"Steps\", is_required: false}]`. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    fieldType: {
      type: "string",
      label: "Field Type",
      description: "Which custom fields to return: `case` for fields on test cases, `result` for fields on test results.",
      options: [
        "case",
        "result",
      ],
    },
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "Only return fields that apply to this project (global fields plus those enabled for it). Use **List Projects** to find it. Leave empty to return every field. Example: `4`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.fieldType === "result"
      ? await this.app.getResultFields({
        $,
      })
      : await this.app.getCaseFields({
        $,
      });
    const fields = response
      .filter((f) => f.is_active)
      .map((f) => {
        const configs = (f.configs ?? []).filter((c) => !this.projectId
          || c.context?.is_global
          || c.context?.project_ids?.includes(this.projectId));
        return {
          configs,
          field: f,
        };
      })
      .filter(({ configs }) => configs.length || !this.projectId)
      .map(({
        configs, field: f,
      }) => {
        const options = configs[0]?.options ?? {};
        const items = options.items
          ? Object.fromEntries(String(options.items).split("\n")
            .map((line) => {
              const [
                id,
                ...label
              ] = line.split(",");
              return [
                id,
                label.join(","),
              ];
            }))
          : undefined;
        return {
          system_name: f.system_name,
          label: f.label,
          type: FIELD_TYPES[f.type_id] ?? String(f.type_id),
          description: f.description,
          is_required: Boolean(options.is_required),
          default_value: options.default_value,
          items,
        };
      });
    $.export("$summary", `Found ${fields.length} ${this.fieldType} field(s)`);
    return fields;
  },
};
