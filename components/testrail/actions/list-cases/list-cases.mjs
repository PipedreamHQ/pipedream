import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "title",
  "section_id",
  "suite_id",
  "type_id",
  "priority_id",
  "refs",
  "updated_on",
];

export default {
  key: "testrail-list-cases",
  name: "List Cases",
  description: "List the test cases of a TestRail project, filtered by suite, section, title text, type or priority. Use it to find cases and, before creating a case with **Add Case**, to check that a similar one does not already exist (pass the key words as `filter`). On multi-suite projects pass suiteId when you know the suite (from **Get Metadata**, resource `suites`); if you omit it, every suite of the project (up to 20) is searched and each case carries its `suite_id`; get sectionId from **List Sections**; the project ID from **List Projects**. These are repository cases, not tests inside a run; for a run's results use **List Tests**. Example: to check for an existing goat-delivery case in project 12, suite 40, call with projectId=12, suiteId=40, filter=\"goat delivery\", fields=[\"title\", \"section_id\"] → returns matching cases with id, title, section_id. Common mistake: relying on one page of a big suite; the tool follows pagination up to `limit` (default 250, hard cap 1000) and `has_more` tells you when more exist, so raise limit or narrow with sectionId. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077292642580-Cases)",
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
      propDefinition: [
        app,
        "sectionId",
      ],
      description: "Only cases in this section. Use **List Sections** to find it.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Title Filter",
      description: "Only cases whose title contains this text (case-insensitive).",
      optional: true,
    },
    typeIds: {
      type: "integer[]",
      label: "Type IDs",
      description: "Only cases of these case types. See **Get Metadata** (resource `case_types`).",
      optional: true,
    },
    priorityIds: {
      type: "integer[]",
      label: "Priority IDs",
      description: "Only cases with these priorities. See **Get Metadata** (resource `priorities`).",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Skip this many cases before collecting results. Only needed to read past `limit`.",
      optional: true,
      min: 0,
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: `Field names to return per case (\`id\` is always included). Defaults to: ${DEFAULT_FIELDS.join(", ")}. Other available: created_on, created_by, estimate, template_id, milestone_id, custom_* fields such as custom_steps_separated and custom_preconds (see **Get Metadata**, resource \`case_fields\`). Steps are large, so request them only when needed.`,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.sectionId) params.section_id = this.sectionId;
    if (this.filter) params.filter = this.filter;
    if (this.typeIds?.length) params.type_id = this.typeIds.join(",");
    if (this.priorityIds?.length) params.priority_id = this.priorityIds.join(",");
    if (this.offset) params.offset = this.offset;
    const suiteIds = await this.app.resolveSuiteIds({
      $,
      projectId: this.projectId,
      suiteId: this.suiteId,
    });
    const pages = await Promise.all(suiteIds.map((suiteId) => this.app.paginate({
      $,
      path: `get_cases/${this.projectId}`,
      resourceKey: "cases",
      params: suiteId
        ? {
          ...params,
          suite_id: suiteId,
        }
        : params,
      max: this.limit,
    })));
    const limit = Math.min(this.limit || 250, 1000);
    const all = pages.flatMap((page) => page.items);
    const items = all.slice(0, limit);
    const hasMore = all.length > limit || pages.some((page) => page.hasMore);
    const cases = utils.selectFields(items, this.fields, DEFAULT_FIELDS);
    $.export("$summary", `Found ${cases.length} case${cases.length === 1
      ? ""
      : "s"}${hasMore
      ? " (more available)"
      : ""}`);
    return {
      cases,
      has_more: hasMore,
    };
  },
};
