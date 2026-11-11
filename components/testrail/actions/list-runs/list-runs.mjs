import app from "../../testrail.app.mjs";
import { toPage } from "../../common/utils.mjs";

export default {
  key: "testrail-list-runs",
  name: "List Runs",
  description: "List test runs of a TestRail project with pass/fail/retest/untested counts, newest first. Use to find a run by name or the latest run without knowing its id (triage starts here), then call **List Tests** with the run id. Use **List Projects** first for `projectId`; in multi-suite projects pass `suiteId` from **List Suites** to narrow. Example: projectId=412, isCompleted=false → returns [{id: 88, name: \"Raptor Containment Regression\", failed_count: 2, passed_count: 1, retest_count: 1, untested_count: 3}]. Match run names yourself from the result; page with `next_offset` if the project has many runs. Does not include plan runs' sub-entries beyond what TestRail returns. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077874763156-Runs)",
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
    suiteId: {
      propDefinition: [
        app,
        "suiteId",
      ],
    },
    isCompleted: {
      type: "boolean",
      label: "Completed Only",
      description: "true = only closed runs, false = only open runs. Omit for both.",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Only runs created after this date/time, ISO 8601, e.g. `2025-03-01` or `2025-03-01T09:00:00Z`.",
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
    const created = this.createdAfter
      ? Math.floor(new Date(this.createdAfter).getTime() / 1000)
      : undefined;
    const response = await this.app.getRuns({
      $,
      projectId: this.projectId,
      params: {
        suite_id: this.suiteId,
        is_completed: this.isCompleted === undefined
          ? undefined
          : Number(this.isCompleted),
        created_after: Number.isNaN(created)
          ? undefined
          : created,
        limit,
        offset: this.offset,
      },
    });
    const page = toPage(response, "runs", {
      offset: this.offset ?? 0,
      limit,
    });
    page.runs = page.runs.map(({
      id, name, suite_id, plan_id, milestone_id, is_completed, created_on, passed_count,
      failed_count, retest_count, blocked_count, untested_count, url,
    }) => ({
      id,
      name,
      suite_id,
      plan_id,
      milestone_id,
      is_completed,
      created_on,
      passed_count,
      failed_count,
      retest_count,
      blocked_count,
      untested_count,
      url,
    }));
    $.export("$summary", `Found ${page.count} run(s) in project ${this.projectId}`);
    return page;
  },
};
