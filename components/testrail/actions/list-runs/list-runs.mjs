import app from "../../testrail.app.mjs";

const DEFAULT_FIELDS = [
  "name",
  "suite_id",
  "is_completed",
  "created_on",
  "passed_count",
  "failed_count",
  "retest_count",
  "blocked_count",
  "untested_count",
  "url",
];

const toUnix = (value) => value
  ? Math.floor(Date.parse(value) / 1000)
  : undefined;

export default {
  key: "testrail-list-runs",
  name: "List Runs",
  description: "Lists the test runs of a TestRail project, usually newest first, with pass/fail counts. Use it to find the latest run, an open run, or a run by name without knowing its ID, for example before triaging failures. To see the individual tests of a run use **List Tests**; to create one use **Create Run**. In a multiple-suite project `suiteId` is optional here (it narrows the list). Returns id, name, suite_id, is_completed, created_on (unix seconds), per-status counts and url by default (choose others with `fields`), plus `hasMore`/`nextOffset`. Example: projectId=\"Isla Nublar Test Lab\", limit=1 → the most recent run, e.g. \"Nightly Containment Build 214\" with its id. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      label: "Completed",
      description: "True returns only closed runs, false only open ones. Leave empty for both.",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Only runs created after this date, ISO 8601, e.g. `2026-11-01` or `2026-11-01T09:00:00Z`.",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Only runs created before this date, ISO 8601, e.g. `2026-11-15`.",
      optional: true,
    },
    milestoneId: {
      type: "integer",
      label: "Milestone ID",
      description: "Only runs that belong to this milestone.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Run fields to return (id is always included). Default: id, name, suite_id, is_completed, created_on, passed_count, failed_count, retest_count, blocked_count, untested_count, url. Other useful ones: description, milestone_id, assignedto_id, plan_id.",
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
    const projectId = await this.app.resolveProjectId($, this.projectId);
    const page = await this.app.listPage({
      $,
      path: `get_runs/${projectId}`,
      key: "runs",
      params: this.app.cleanParams({
        suite_id: this.suiteId,
        is_completed: this.isCompleted === undefined
          ? undefined
          : Number(this.isCompleted),
        created_after: toUnix(this.createdAfter),
        created_before: toUnix(this.createdBefore),
        milestone_id: this.milestoneId,
      }),
      limit: this.limit,
      offset: this.offset,
    });
    page.items = this.app.pluck(page.items, this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS);
    $.export("$summary", `Found ${page.size} runs`);
    return page;
  },
};
