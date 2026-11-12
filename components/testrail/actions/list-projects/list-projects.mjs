import app from "../../testrail.app.mjs";

export default {
  key: "testrail-list-projects",
  name: "List Projects",
  description: "List the TestRail projects the connected account can see, with each project's id, name and `suite_mode`."
    + " Use this first in almost every TestRail flow: the project id is required by **List Runs**, **List Sections**, **List Cases**, **Add Section** and **Get Metadata**, and users usually refer to a project by name."
    + " `suite_mode` tells you whether the project has multiple suites (3) or a single suite (1 or 2); the other tools handle multi-suite projects for you when you leave `suiteId` empty."
    + " Example: to find the id of the project named \"Checkout Web\", call with no arguments → returns `{ total, projects: [{ id: 12, name: \"Checkout Web\", suite_mode: 3, is_completed: false, url }] }`."
    + " Completed projects are included unless `isCompleted` is false."
    + " [See the documentation](https://support.testrail.com/hc/en-us/articles/7077792415124-Projects)",
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
      label: "Completed Only",
      description: "`true` returns only completed projects, `false` only active ones. Omit to return both.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { items } = await this.app.paginate({
      endpoint: "get_projects",
      params: {
        is_completed: this.isCompleted === undefined
          ? undefined
          : Number(this.isCompleted),
      },
      collection: "projects",
      limit: 1000,
    });
    const projects = items.map(({
      id, name, suite_mode, is_completed, announcement, url,
    }) => ({
      id,
      name,
      suite_mode,
      is_completed,
      announcement,
      url,
    }));
    $.export("$summary", `Found ${projects.length} project${projects.length === 1
      ? ""
      : "s"}`);
    return {
      total: projects.length,
      projects,
    };
  },
};
