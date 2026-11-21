import app from "../../testrail.app.mjs";

export default {
  key: "testrail-list-suites",
  name: "List Suites",
  description: "Lists the test suites of a TestRail project. Use it when a project is in multi-suite mode (`suite_mode` 3 in **List Projects**) and the user names a suite, because **List Cases**, **List Sections** and section creation need its suite ID there. Not for finding projects (use **List Projects**) or the cases inside a suite (use **List Cases**). Single-suite projects return one suite called Master. Returns each suite's id, name, description, is_completed and url. Example: projectId=4 → suites such as `{id: 28, name: \"Velociraptor Paddock\"}`. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    const response = await this.app._makeRequest({
      $,
      path: `get_suites/${this.projectId}`,
    });
    const items = Array.isArray(response)
      ? response
      : response?.suites ?? [];
    const suites = items.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      is_completed: s.is_completed,
      url: s.url,
    }));
    $.export("$summary", `Found ${suites.length} suite(s) in project ${this.projectId}`);
    return suites;
  },
};
