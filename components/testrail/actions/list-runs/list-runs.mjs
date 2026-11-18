import app from "../../testrail.app.mjs";

const DEFAULT_FIELDS = [
  "name",
  "suite_id",
  "is_completed",
  "created_on",
  "passed_count",
  "failed_count",
  "blocked_count",
  "retest_count",
  "untested_count",
  "url",
];

export default {
  key: "testrail-list-runs",
  name: "List Runs",
  description: "List the test runs of a TestRail project, newest first, with pass/fail counts. Use it to find a run by name, to get \"the latest run\", or to see how a run is doing without reading its tests. To list the individual tests of a run, use **List Tests** instead. Runs that belong to a test plan are not included. Always pass `fields` to keep the response small; ids are always returned. Returns id, name, suite_id, is_completed, created_on (ISO), per-status counts and url by default. Example: projectId=4, suiteId=15, isCompleted=false, maxResults=5 → the 5 newest open runs with failed_count and untested_count. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      description: "Only return runs of this suite, e.g. `15`. Use **List Suites** to find it.",
    },
    isCompleted: {
      type: "boolean",
      label: "Is Completed",
      description: "Set to `false` for open runs only or `true` for closed runs only. Leave empty for both.",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Only runs created after this ISO 8601 date or datetime, e.g. `2026-11-01` or `2026-11-01T09:00:00Z`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
      description: "The most runs to return, newest first. Defaults to 25 to keep responses small; the maximum is 1000. If more exist, the response says `truncated: true`, so raise this or narrow with Suite ID, Is Completed or Created After.",
      default: 25,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Run fields to return, e.g. `[\"name\", \"failed_count\"]`. `id` is always included. Defaults to: name, suite_id, is_completed, created_on, passed_count, failed_count, blocked_count, retest_count, untested_count, url. Other run fields include description, assignedto_id, milestone_id, plan_id, refs and created_by.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.suiteId) params.suite_id = this.suiteId;
    if (this.isCompleted !== undefined) params.is_completed = this.isCompleted
      ? 1
      : 0;
    if (this.createdAfter) {
      const ms = Date.parse(this.createdAfter);
      if (Number.isNaN(ms)) throw new Error("createdAfter must be an ISO 8601 date such as 2026-11-01");
      params.created_after = Math.floor(ms / 1000);
    }
    let page;
    try {
      page = await this.app.paginate({
        $,
        endpoint: `get_runs/${this.projectId}`,
        key: "runs",
        params,
        maxResults: this.maxResults,
      });
    } catch (err) {
      throw this.app.suiteHint(err, this.suiteId);
    }
    const {
      items, truncated,
    } = page;
    const runs = items
      .sort((a, b) => b.created_on - a.created_on)
      .map((r) => this.app.shape(r, this.fields, DEFAULT_FIELDS));
    $.export("$summary", `Found ${runs.length} run(s)${truncated
      ? " (more exist)"
      : ""}`);
    return {
      runs,
      count: runs.length,
      truncated,
    };
  },
};
