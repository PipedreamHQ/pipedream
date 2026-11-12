import app from "../../testrail.app.mjs";

const SECTIONS = [
  "suites",
  "statuses",
  "caseFields",
  "resultFields",
  "caseTypes",
  "priorities",
  "templates",
];
const DEFAULT_SECTIONS = [
  "statuses",
  "priorities",
  "caseTypes",
];
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
  14: "Scenario Results",
  16: "Rating",
};

function summarizeFields(fields, projectId) {
  return fields.map((field) => {
    const configs = (field.configs || []).filter(({ context }) => context?.is_global
      || !projectId
      || (context.project_ids || []).includes(projectId));
    const options = configs[0]?.options || {};
    return {
      id: field.id,
      system_name: field.system_name,
      label: field.label,
      type: FIELD_TYPES[field.type_id] || String(field.type_id),
      is_active: field.is_active,
      is_required: configs.some((c) => c.options?.is_required),
      description: field.description,
      items: options.items,
    };
  });
}

export default {
  key: "testrail-get-metadata",
  name: "Get Metadata",
  description: "Discover what values and fields this TestRail instance accepts: statuses, priorities, case types, case templates, custom case fields, custom result fields and a project's suites. Pick sections with `include`."
    + " Use before **Add Result** (status ids/labels, required result fields), **Add Case** (priority and type ids, template ids, the custom field names for steps and expected results) and whenever a project is multi-suite and you need a suite id."
    + " Default `include` is `statuses`, `priorities`, `caseTypes`. Only request what you need. `suites` and `templates` need `projectId` (from **List Projects**) and are skipped without it. Statuses 1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed are built in; instances can add custom ones."
    + " Custom fields: `system_name` is the key to send in `customFields` (case fields look like `custom_steps_separated`, `custom_preconds`); `is_required` marks fields the instance insists on; steps live in the `custom_steps_separated` field when the template is \"Test Case (Steps)\" (template id 2)."
    + " Example: to see how to record a failure, call with include=[\"statuses\",\"resultFields\"] → returns `{ statuses: [{ id: 5, label: \"Failed\", ... }], resultFields: [{ system_name: \"defects\", type: \"String\", is_required: false }, ...] }`."
    + " [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      description: `Which metadata to return. Any of: ${SECTIONS.join(", ")}. Defaults to ${DEFAULT_SECTIONS.join(", ")}.`,
      options: SECTIONS,
      optional: true,
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
      description: "Project id. Needed for `suites` and `templates`; also narrows custom fields to the ones active in that project. Use **List Projects** to find it.",
      optional: true,
    },
  },
  async run({ $ }) {
    const include = this.include?.length
      ? this.include
      : DEFAULT_SECTIONS;
    const unknown = include.filter((name) => !SECTIONS.includes(name));
    if (unknown.length) {
      throw new Error(`Unknown include value(s): ${unknown.join(", ")}. Valid: ${SECTIONS.join(", ")}`);
    }
    // Sections that need a project are skipped (and reported) rather than failing the whole call,
    // so asking for "everything" without a project still returns the global sections.
    const needsProject = [
      "suites",
      "templates",
    ];
    const skipped = this.projectId
      ? []
      : include.filter((name) => needsProject.includes(name));
    const toFetch = include.filter((name) => !skipped.includes(name));

    const endpoints = {
      statuses: () => this.app._makeRequest({
        endpoint: "get_statuses",
      }),
      priorities: () => this.app._makeRequest({
        endpoint: "get_priorities",
      }),
      caseTypes: () => this.app._makeRequest({
        endpoint: "get_case_types",
      }),
      templates: () => this.app._makeRequest({
        endpoint: `get_templates/${this.projectId}`,
      }),
      suites: async () => (await this.app.paginate({
        endpoint: `get_suites/${this.projectId}`,
        key: "suites",
      })).items.map(({
        id, name, description, is_completed,
      }) => ({
        id,
        name,
        description,
        is_completed,
      })),
      caseFields: async () => summarizeFields(await this.app._makeRequest({
        endpoint: "get_case_fields",
      }), this.projectId),
      resultFields: async () => summarizeFields(await this.app._makeRequest({
        endpoint: "get_result_fields",
      }), this.projectId),
    };
    const entries = await Promise.all(toFetch.map(async (name) => [
      name,
      await endpoints[name](),
    ]));
    $.export("$summary", `Fetched TestRail metadata: ${include.join(", ")}`);
    const result = Object.fromEntries(entries);
    if (skipped.length) {
      result.skipped = `${skipped.join(", ")} need projectId: call again with projectId (see List Projects).`;
    }
    return result;
  },
};
