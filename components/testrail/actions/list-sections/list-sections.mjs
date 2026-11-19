import app from "../../testrail.app.mjs";

export default {
  key: "testrail-list-sections",
  name: "List Sections",
  description: "List the sections (folders) that organize test cases in a TestRail project or suite. Use it to find the section ID where a new case belongs, or to show how a suite is organized. To create a new section, use **Create Section**; to list the cases inside a section, use **List Cases** instead. In multi-suite projects a suite ID is needed. Returns each section's id, name, description, parent_id, suite_id and depth. Example: projectId=4, suiteId=15 → [{id: 74, name: \"Paddock Security\", parent_id: null, depth: 0}]. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
  },
  async run({ $ }) {
    const params = {};
    if (this.suiteId) params.suite_id = this.suiteId;
    let page;
    try {
      page = await this.app.paginate({
        $,
        endpoint: `get_sections/${this.projectId}`,
        key: "sections",
        params,
        maxResults: 1000,
      });
    } catch (err) {
      throw this.app.suiteHint(err, this.suiteId);
    }
    const { items } = page;
    const sections = items.map((s) => this.app.shape(s, [], [
      "name",
      "description",
      "parent_id",
      "suite_id",
      "depth",
    ]));
    $.export("$summary", `Found ${sections.length} section(s)`);
    return {
      sections,
      count: sections.length,
    };
  },
};
