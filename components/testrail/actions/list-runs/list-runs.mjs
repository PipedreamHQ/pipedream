import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "name",
  "suite_id",
  "is_completed",
  "created_on",
  "passed_count",
  "failed_count",
  "untested_count",
  "url",
];

export default {
  key: "testrail-list-runs",
  name: "List Runs",
  description: "List the test runs in a TestRail project, newest first, with pass/fail/retest/blocked/untested counts. Use it to find a run by name or to find the latest run when the user has no run ID (\"the last nightly run\"), then pass the run `id` to **List Tests**. Get the project ID from **List Projects**. Example: to find the latest open run in project 12, call with projectId=12, isCompleted=false, limit=1 → returns the run with id, name, suite_id, created_on and passed/failed/untested counts. Runs that belong to a test plan are included. Common mistake: scanning every run to count failures; the `failed_count` field already has it. Returns at most 250 runs by default (hard cap 1000). [See the documentation](https://support.testrail.com/hc/en-us/articles/7077874763156-Runs)",
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
      description: "Only runs of this suite. Use **Get Metadata** with resource `suites` to find it.",
    },
    isCompleted: {
      type: "boolean",
      label: "Completed Only",
      description: "`true` returns only closed runs, `false` only open ones. Omit for both.",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Only runs created on or after this date, as an ISO date (`2026-11-01`) or unix timestamp in seconds.",
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
      description: `Field names to return per run (\`id\` is always included). Defaults to: ${DEFAULT_FIELDS.join(", ")}. Other available: plan_id, milestone_id, retest_count, blocked_count, description, assignedto_id, created_by, completed_on, config, refs.`,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.suiteId) params.suite_id = this.suiteId;
    if (this.isCompleted !== undefined) {
      params.is_completed = this.isCompleted
        ? 1
        : 0;
    }
    if (this.createdAfter) {
      const asNumber = Number(this.createdAfter);
      params.created_after = Number.isFinite(asNumber)
        ? asNumber
        : Math.floor(new Date(this.createdAfter).getTime() / 1000);
      if (Number.isNaN(params.created_after)) {
        throw new Error("createdAfter must be an ISO date like 2026-11-01 or a unix timestamp in seconds");
      }
    }
    const {
      items, hasMore,
    } = await this.app.paginate({
      $,
      path: `get_runs/${this.projectId}`,
      resourceKey: "runs",
      params,
      max: this.limit,
    });
    const runs = utils.selectFields(items, this.fields, DEFAULT_FIELDS);
    $.export("$summary", `Found ${runs.length} run${runs.length === 1
      ? ""
      : "s"}`);
    return {
      runs,
      has_more: hasMore,
    };
  },
};
