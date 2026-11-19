import app from "../../testrail.app.mjs";

export default {
  key: "testrail-list-suites",
  name: "List Suites",
  description: "List the test suites of a TestRail project. Use it when the project uses multiple suites and the user names a suite, since cases, sections and runs then need the suite ID. To find the project ID first, use **List Projects**; for the sections inside a suite, use **List Sections** instead. Returns each suite's id, name, description, is_completed and url. Example: projectId=4 → [{id: 15, name: \"Raptor Containment\"}, {id: 16, name: \"Visitor Center\"}]. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
  },
  async run({ $ }) {
    const { items } = await this.app.paginate({
      $,
      endpoint: `get_suites/${this.projectId}`,
      key: "suites",
      maxResults: 1000,
    });
    const suites = items.map((s) => this.app.shape(s, [], [
      "name",
      "description",
      "is_completed",
      "url",
    ]));
    $.export("$summary", `Found ${suites.length} suite(s) in project ${this.projectId}`);
    return {
      suites,
      count: suites.length,
    };
  },
};
