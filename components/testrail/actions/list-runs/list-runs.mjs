import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "name",
  "suite_id",
  "created_on",
  "is_completed",
  "passed_count",
  "failed_count",
  "retest_count",
  "blocked_count",
  "untested_count",
  "url",
];

export default {
  key: "testrail-list-runs",
  name: "List Runs",
  description: "List test runs in a TestRail project, newest first, so \"the latest run\" needs no run id."
    + " Use to find the run whose failures you want to triage, then call **List Tests** with the run's `id`. Each run carries pass/fail/retest/untested counts, so a glance shows which run has failures."
    + " Leave `suiteId` empty to include every suite. Standalone runs only: runs inside test plans are not listed."
    + " Returns `{ total, truncated, runs }`; default `limit` is 20 (max 250), with a compact default field set. Pass `fields` to change it (`id` is always included)."
    + " Example: to find the most recent run in project 12, call with projectId=12, limit=1 → returns `{ runs: [{ id: 540, name: \"Nightly Regression 214\", failed_count: 3, created_on: 1794465337 }] }`."
    + " Timestamps are unix seconds. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077874763540-Runs)",
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
      description: "`true` returns only closed runs, `false` only open runs. Omit to return both.",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Only runs created after this time. ISO 8601 (e.g. `2026-11-01` or `2026-11-01T09:00:00Z`) or unix seconds.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum runs to return (default 20, max 250).",
      optional: true,
      min: 1,
      max: 250,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: `Run fields to return (\`id\` is always included). Default: ${DEFAULT_FIELDS.join(", ")}. Other useful ones: description, milestone_id, assignedto_id, include_all, config, due_on, refs.`,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      items, truncated,
    } = await this.app.paginate({
      endpoint: `get_runs/${this.projectId}`,
      params: {
        suite_id: this.suiteId,
        is_completed: this.isCompleted === undefined
          ? undefined
          : Number(this.isCompleted),
        created_after: utils.toUnixSeconds(this.createdAfter),
      },
      collection: "runs",
      limit: Math.min(this.limit || 20, 250),
    });
    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const runs = items.map((run) => utils.pluck(run, fields));
    $.export("$summary", `Found ${runs.length} run${runs.length === 1
      ? ""
      : "s"}${truncated
      ? " (more available)"
      : ""}`);
    return {
      total: runs.length,
      truncated,
      runs,
    };
  },
};
