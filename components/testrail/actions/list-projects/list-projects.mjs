import app from "../../testrail.app.mjs";

export default {
  key: "testrail-list-projects",
  name: "List Projects",
  description: "Lists TestRail projects with their IDs and suite mode. Use it first to find a project ID before listing cases, sections or runs, or when the user names a project. For the suites inside one project use **Get Project**; this tool does not return suites. Returns id, name, suite_mode (1 single suite, 2 single suite plus baselines, 3 multiple suites; mode 3 means calls need a suite ID), is_completed and url, plus `hasMore`/`nextOffset`. Example: isCompleted=false → the active projects. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    isCompleted: {
      type: "boolean",
      label: "Completed",
      description: "True returns only completed projects, false only active ones. Leave empty for all.",
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
    const page = await this.app.listPage({
      $,
      path: "get_projects",
      key: "projects",
      params: this.app.cleanParams({
        is_completed: this.isCompleted === undefined
          ? undefined
          : Number(this.isCompleted),
      }),
      limit: this.limit,
      offset: this.offset,
    });
    page.items = page.items.map(({
      id, name, suite_mode, is_completed, url,
    }) => ({
      id,
      name,
      suite_mode,
      is_completed,
      url,
    }));
    $.export("$summary", `Found ${page.size} projects`);
    return page;
  },
};
