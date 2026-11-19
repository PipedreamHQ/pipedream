import app from "../../testrail.app.mjs";

export default {
  key: "testrail-list-projects",
  name: "List Projects",
  description: "List the projects in the connected TestRail instance. Use it first whenever the user names a project, because every other TestRail tool needs the numeric project ID. To list a project's suites, use **List Suites** instead. Returns each project's id, name, suite_mode (1 single suite, 2 single suite plus baselines, 3 multiple suites; mode 3 means cases, sections and runs need a suite ID), is_completed and url. Takes no inputs and includes completed projects (see is_completed). Example: no inputs → [{id: 4, name: \"Isla Nublar Test Lab\", suite_mode: 3}]. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
  },
  async run({ $ }) {
    const { items } = await this.app.paginate({
      $,
      endpoint: "get_projects",
      key: "projects",
      maxResults: 1000,
    });
    const projects = items.map((p) => this.app.shape(p, [], [
      "name",
      "suite_mode",
      "is_completed",
      "url",
    ]));
    $.export("$summary", `Found ${projects.length} project(s)`);
    return {
      projects,
      count: projects.length,
    };
  },
};
