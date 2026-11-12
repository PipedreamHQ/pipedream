import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "name",
  "suite_mode",
  "is_completed",
  "url",
];

export default {
  key: "testrail-list-projects",
  name: "List Projects",
  description: "List the TestRail projects the connected account can see. Start here whenever the user names a project: every other TestRail tool needs the numeric project ID. Each project includes `suite_mode` (1 = single suite, 2 = single suite + baselines, 3 = multiple suites); in mode 3, **List Cases** and other suite-aware tools need a `suiteId` (find it with **Get Metadata**, resource `suites`). Example: to find the \"Checkout Web\" project, call with no arguments and match on `name` → returns projects with id, name, suite_mode, is_completed, url. Common mistake: guessing a project ID instead of looking it up. Returns at most 250 projects by default. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077792415124-Projects)",
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
      description: "`true` returns only completed projects, `false` only active ones. Omit for all projects.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: `Field names to return per project (\`id\` is always included). Defaults to: ${DEFAULT_FIELDS.join(", ")}. Other available: announcement, show_announcement, completed_on, default_role_id, case_statuses_enabled.`,
    },
  },
  async run({ $ }) {
    const {
      items, hasMore,
    } = await this.app.paginate({
      $,
      path: "get_projects",
      resourceKey: "projects",
      params: this.isCompleted === undefined
        ? {}
        : {
          is_completed: this.isCompleted
            ? 1
            : 0,
        },
      max: this.limit,
    });
    const projects = utils.selectFields(items, this.fields, DEFAULT_FIELDS);
    $.export("$summary", `Found ${projects.length} project${projects.length === 1
      ? ""
      : "s"}`);
    return {
      projects,
      has_more: hasMore,
    };
  },
};
