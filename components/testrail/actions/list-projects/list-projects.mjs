import app from "../../testrail.app.mjs";
import { toPage } from "../../common/utils.mjs";

export default {
  key: "testrail-list-projects",
  name: "List Projects",
  description: "List the TestRail projects the connected user can see, with id, name, `suite_mode` and completion state. Start here: nearly every other TestRail tool needs a `projectId`. `suite_mode` tells you whether the project uses suites: 1 = single suite, 2 = single suite + baselines, 3 = multiple suites (then use **List Suites** and pass `suiteId` to **List Cases**, **List Sections** and **Create Run**). Example: call with no parameters → returns projects like {id: 7, name: \"Isla Nublar Test Lab\", suite_mode: 3, is_completed: false}. Find a project by scanning the names in the result. Large accounts: if `next_offset` is not null, call again with `offset`. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077792415124-Projects)",
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
      description: "true = only completed projects, false = only active projects. Omit for all.",
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
    const limit = this.limit ?? 100;
    const response = await this.app.getProjects({
      $,
      params: {
        is_completed: this.isCompleted === undefined
          ? undefined
          : Number(this.isCompleted),
        limit,
        offset: this.offset,
      },
    });
    const page = toPage(response, "projects", {
      offset: this.offset ?? 0,
      limit,
    });
    page.projects = page.projects.map(({
      id, name, suite_mode, is_completed, url, announcement,
    }) => ({
      id,
      name,
      suite_mode,
      is_completed,
      url,
      announcement,
    }));
    $.export("$summary", `Found ${page.count} project(s)`);
    return page;
  },
};
