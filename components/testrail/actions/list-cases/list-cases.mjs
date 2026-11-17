import app from "../../testrail.app.mjs";

const DEFAULT_FIELDS = [
  "title",
  "section_id",
  "suite_id",
  "priority_id",
  "type_id",
];

export default {
  key: "testrail-list-cases",
  name: "List Cases",
  description: "Searches the test cases of a TestRail project or suite by title text, section, priority or type. Use it to find a case ID, to check whether a case already exists before creating one, or to count the cases in a suite. For one case's steps and custom fields use **Get Case**; for the cases inside a run (with their status) use **List Tests**. In a multiple-suite project (suite_mode 3) `suiteId` is required. Returns up to `limit` cases (default 100, max 250) with the requested `fields` (default id, title, section_id, suite_id, priority_id, type_id) plus `hasMore`/`nextOffset`; follow `nextOffset` until `hasMore` is false to see every case. Example: projectId=\"Isla Nublar Test Lab\", suiteId=15, title=\"fence\" → case \"Electric fence failover\" with its id. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    suiteId: {
      propDefinition: [
        app,
        "suiteId",
      ],
    },
    sectionId: {
      type: "integer",
      label: "Section ID",
      description: "Only return cases in this section. Use **List Sections** to find it.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title Contains",
      description: "Only return cases whose title contains this text, e.g. `fence`.",
      optional: true,
    },
    priorityIds: {
      type: "integer[]",
      label: "Priority IDs",
      description: "Only return cases with these priority IDs. Defaults: 1 Low, 2 Medium, 3 High, 4 Critical. Use **Get Reference Data** with `referenceType` = `priorities`.",
      optional: true,
    },
    typeIds: {
      type: "integer[]",
      label: "Type IDs",
      description: "Only return cases of these case type IDs. Use **Get Reference Data** with `referenceType` = `case_types`.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Case fields to return (id is always included). Default: id, title, section_id, suite_id, priority_id, type_id. Other useful ones: refs, estimate, created_on, updated_on, custom_steps_separated. Pass only what you need to keep the response small.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const projectId = await this.app.resolveProjectId($, this.projectId);
    const page = await this.app.listPage({
      $,
      path: `get_cases/${projectId}`,
      key: "cases",
      params: this.app.cleanParams({
        suite_id: this.suiteId,
        section_id: this.sectionId,
        filter: this.title,
        priority_id: this.priorityIds?.join(","),
        type_id: this.typeIds?.join(","),
      }),
      limit: this.limit,
      offset: this.offset,
    });
    page.items = this.app.pluck(page.items, this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS);
    $.export("$summary", `Found ${page.size} cases${page.hasMore
      ? " (more available)"
      : ""}`);
    return page;
  },
};
