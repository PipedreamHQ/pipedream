import logbrew from "../../logbrew.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "logbrew-list-issues",
  name: "List Issues",
  description: "List the grouped error issues of a LogBrew project, most recently seen first, with each issue's `id`, `title`, `status`, and dashboard link. Use it to find the issue ID that **Resolve Issue** takes. Use **List Projects** to find the project ID. [See the documentation](https://docs.logbrew.co/reference/telemetry-api#telemetry-reads)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    logbrew,
    projectId: {
      propDefinition: [
        logbrew,
        "projectId",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Return only issues with this status, e.g. `unresolved`. Leave empty for all statuses.",
      options: [
        "unresolved",
        "resolved",
        "archived",
      ],
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The most issues to return, from 1 to 500, e.g. `50`",
      min: 1,
      max: 500,
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const issues = await this.logbrew.listIssues({
      $,
      params: {
        project_id: this.projectId,
        status: this.status,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${issues.length} issue${issues.length === 1
      ? ""
      : "s"}`);
    const dashboardUrl = this.logbrew.getDashboardUrl();
    return issues.map((issue) => utils.withIssueUrl(issue, dashboardUrl));
  },
};
