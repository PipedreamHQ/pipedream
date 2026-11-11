import app from "../../testrail.app.mjs";

const FIELD_TYPES = {
  1: "string",
  2: "integer",
  3: "text",
  4: "url",
  5: "checkbox",
  6: "dropdown",
  7: "user",
  8: "date",
  9: "milestone",
  10: "steps",
  11: "step_results",
  12: "multi_select",
};

// Field definitions repeat a large per-template/per-project config block; boil it down
// to what a caller needs to fill the field in.
function compactField(field) {
  const configs = field.configs ?? [];
  const options = configs.map((c) => c.options ?? {});
  const items = options.map((o) => o.items).find(Boolean);
  return {
    id: field.id,
    system_name: field.system_name,
    label: field.label,
    type: FIELD_TYPES[field.type_id] ?? field.type_id,
    is_active: field.is_active,
    is_required: options.some((o) => o.is_required),
    description: field.description,
    items,
    templates: field.template_ids,
  };
}

const KINDS = [
  "statuses",
  "case_fields",
  "result_fields",
  "case_types",
  "priorities",
  "templates",
];

export default {
  key: "testrail-list-metadata",
  name: "List Metadata",
  description: "Discover this TestRail instance's configurable values and fields, so writes use valid ids. `kind` selects what to list: `statuses` = result statuses with ids (default 1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed, plus custom ones) — use before **Add Result**; `case_fields` = custom case fields with `system_name`, type, `is_required` and options per template — use before **Create Case** / **Update Case** to know which `custom_*` keys (steps, expected result, preconditions) to send; `result_fields` = custom result fields for **Add Result**; `case_types`, `priorities` = ids for `typeId` / `priorityId`; `templates` = case templates of a project (needs `projectId`). Example: kind=\"statuses\" → returns [{id: 5, name: \"failed\", label: \"Failed\"}, ...]. Never hardcode status ids: instances can add custom statuses. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077935129364-Statuses)",
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
    kind: {
      type: "string",
      label: "Kind",
      description: "What to list: statuses, case_fields, result_fields, case_types, priorities, or templates (templates needs `projectId`).",
      options: KINDS,
    },
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "Only used for kind=templates. Use **List Projects** to find it.",
      optional: true,
    },
  },
  async run({ $ }) {
    let items;
    switch (this.kind) {
    case "statuses":
      items = await this.app.getStatuses({
        $,
      });
      break;
    case "case_fields":
      items = await this.app.getCaseFields({
        $,
      });
      break;
    case "result_fields":
      items = await this.app.getResultFields({
        $,
      });
      break;
    case "case_types":
      items = await this.app.getCaseTypes({
        $,
      });
      break;
    case "priorities":
      items = await this.app.getPriorities({
        $,
      });
      break;
    case "templates":
      if (!this.projectId) {
        throw new Error("projectId is required for kind=templates");
      }
      items = await this.app.getTemplates({
        $,
        projectId: this.projectId,
      });
      break;
    default:
      throw new Error(`Unknown kind "${this.kind}". Use one of: ${KINDS.join(", ")}`);
    }
    const list = Array.isArray(items)
      ? items
      : Object.values(items).find(Array.isArray) ?? [];
    $.export("$summary", `Listed ${list.length} ${this.kind}`);
    return {
      kind: this.kind,
      items: this.kind === "case_fields" || this.kind === "result_fields"
        ? list.map(compactField)
        : this.kind === "statuses"
          ? list.map(({
            id, name, label, is_untested, is_final,
          }) => ({
            id,
            name,
            label,
            is_untested,
            is_final,
          }))
          : list,
      count: list.length,
    };
  },
};
