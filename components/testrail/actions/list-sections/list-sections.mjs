import app from "../../testrail.app.mjs";

export default {
  key: "testrail-list-sections",
  name: "List Sections",
  description: "Lists the sections (folders of test cases) in a TestRail project or suite. Use it to find the section ID that **Create Case** needs, to pick a parent for **Create Section**, or to see how a suite is organised. Not for the cases inside a section: use **List Cases** with the section ID. Multi-suite projects need `suiteId`; sections may be nested, so check parent_id and depth. Returns each section's id, name, description, parent_id, suite_id and depth. Example: projectId=4, suiteId=28 → `[{id: 136, name: \"Feeding Schedules\", parent_id: null}]`. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
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
    const {
      items, has_more, next_offset,
    } = await this.app.paginate({
      $,
      path: `get_sections/${this.projectId}`,
      key: "sections",
      params: {
        suite_id: this.suiteId,
      },
      maxResults: this.maxResults ?? 250,
      offset: this.offset,
    });
    const sections = items.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      parent_id: s.parent_id,
      suite_id: s.suite_id,
      depth: s.depth,
    }));
    $.export("$summary", `Found ${sections.length} section(s) in project ${this.projectId}`);
    return {
      sections,
      has_more,
      next_offset,
    };
  },
};
