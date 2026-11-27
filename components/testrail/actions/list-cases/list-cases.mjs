import app from "../../testrail.app.mjs";

const DEFAULT_FIELDS = [
  "title",
  "section_id",
  "suite_id",
  "priority_id",
  "type_id",
  "refs",
  "updated_on",
];

export default {
  key: "testrail-list-cases",
  name: "List Cases",
  description: "List or search the test cases of a TestRail project, optionally within one suite or section or by title text. Use it to find a case, to check whether a similar case already exists before creating one, or to count cases. For one case's steps and custom fields, use **Get Case** instead; to add a case, use **Create Case**. Projects with multiple suites need a suite ID. Always pass `fields`, because full case objects are large; ids are always returned. Returns id, title, section_id, suite_id, priority_id, type_id, refs and updated_on (ISO) by default, plus `truncated` when more exist. Example: projectId=4, suiteId=15, titleContains=\"hoist\", fields=[\"title\"] → [{id: 1067, title: \"Goat delivery hoist\"}]. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      description: "Only return cases in this section, e.g. `74`. Use **List Sections** to find it.",
      optional: true,
    },
    titleContains: {
      type: "string",
      label: "Title Contains",
      description: "Only return cases whose title contains this text, e.g. `login`. Case-insensitive.",
      optional: true,
    },
    priorities: {
      type: "string[]",
      label: "Priorities",
      description: "Only return cases with these priorities, as names or ids, e.g. `[\"Critical\", \"High\"]`. Use **Get Configuration** to see the valid priorities.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Case fields to return, e.g. `[\"title\", \"section_id\"]`. `id` is always included. Defaults to: title, section_id, suite_id, priority_id, type_id, refs, updated_on. Other fields include template_id, estimate, created_by and custom_* fields (use **Get Configuration** to list them).",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.suiteId) params.suite_id = this.suiteId;
    if (this.sectionId) params.section_id = this.sectionId;
    if (this.titleContains) params.filter = this.titleContains;
    if (this.priorities?.length) {
      const ids = [];
      for (const p of this.priorities) ids.push(await this.app.resolvePriority($, p));
      params.priority_id = ids.join(",");
    }
    let page;
    try {
      page = await this.app.paginate({
        $,
        endpoint: `get_cases/${this.projectId}`,
        key: "cases",
        params,
        maxResults: this.maxResults,
      });
    } catch (err) {
      throw this.app.suiteHint(err, this.suiteId);
    }
    const {
      items, truncated,
    } = page;
    const cases = items.map((c) => this.app.shape(c, this.fields, DEFAULT_FIELDS));
    $.export("$summary", `Found ${cases.length} case(s)${truncated
      ? " (more exist)"
      : ""}`);
    return {
      cases,
      count: cases.length,
      truncated,
    };
  },
};
