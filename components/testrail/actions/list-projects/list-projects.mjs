import app from "../../testrail.app.mjs";

export default {
  key: "testrail-list-projects",
  name: "List Projects",
  description: "Lists the TestRail projects the connected account can see. Use it first whenever the user names a project, to get the project ID that most other TestRail tools need, and to see whether the project has one suite or several. Not for runs, suites or cases: use **List Runs**, **List Suites** or **List Cases** with the project ID. Returns each project's id, name, suite_mode (1 = single suite, 2 = single suite with baselines, 3 = multiple suites), is_completed and url and url. Example: no inputs → `[{id: 4, name: \"Isla Nublar Test Lab\", suite_mode: 3}]`. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const { items } = await this.app.paginate({
      $,
      path: "get_projects",
      key: "projects",
      maxResults: this.maxResults,
    });
    const projects = items.map((p) => ({
      id: p.id,
      name: p.name,
      suite_mode: p.suite_mode,
      is_completed: p.is_completed,
      announcement: p.announcement,
      url: p.url,
    }));
    $.export("$summary", `Found ${projects.length} project(s)`);
    return projects;
  },
};
