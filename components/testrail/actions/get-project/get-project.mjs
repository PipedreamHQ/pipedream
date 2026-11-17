import app from "../../testrail.app.mjs";

export default {
  key: "testrail-get-project",
  name: "Get Project",
  description: "Gets one TestRail project together with its suites. Use it when you need suite IDs: projects in multiple-suite mode (suite_mode 3) require a suite ID for **List Cases**, **List Sections**, **Create Section** and **Create Run**. To find a project in the first place use **List Projects**. Returns the project (id, name, suite_mode, url) and `suites` (id, name, description). Example: projectId=\"Isla Nublar Test Lab\" → the project and its suites Raptor Containment, Visitor Center, Write Sandbox. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    const projectId = await this.app.resolveProjectId($, this.projectId);
    const [
      project,
      suites,
    ] = await Promise.all([
      this.app.get({
        $,
        path: `get_project/${projectId}`,
      }),
      this.app.get({
        $,
        path: `get_suites/${projectId}`,
      }),
    ]);
    const result = {
      id: project.id,
      name: project.name,
      suite_mode: project.suite_mode,
      is_completed: project.is_completed,
      url: project.url,
      suites: this.app.unwrap(suites, "suites").map(({
        id, name, description,
      }) => ({
        id,
        name,
        description,
      })),
    };
    $.export("$summary", `Project ${project.name} has ${result.suites.length} suite(s)`);
    return result;
  },
};
