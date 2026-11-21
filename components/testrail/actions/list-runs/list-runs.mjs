import app from "../../testrail.app.mjs";
import {
  pluck, toIso,
} from "../../common/utils.mjs";

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
];

export default {
  key: "testrail-list-runs",
  name: "List Runs",
  description: "Lists the test runs of a TestRail project, newest first, with pass/fail counts (the 10 most recent unless `maxResults` is set). Use it to find the latest run, find a run by name, or see how many tests failed, without knowing a run ID. Not for the individual tests inside a run: use **List Tests** with the run ID from here. Multi-suite projects return runs of every suite unless `suiteId` is set. Returns each run's id, name, suite_id, is_completed, created_on (ISO-8601) and passed/failed/retest/blocked/untested counts; pass `fields` to add `url` and others. Example: projectId=4, maxResults=5 → the five most recent runs, e.g. `{id: 86, name: \"Velociraptor Paddock Regression\", failed_count: 3}`. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      label: "Completed Runs Only",
      description: "Set to `true` for only closed runs, `false` for only open runs. Leave empty for both.",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Only return runs created on or after this ISO-8601 date or datetime. Example: `2026-11-01` or `2026-11-01T09:00:00Z`.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Field names to return per run (`id` is always included). Defaults to: name, suite_id, is_completed, created_on, passed_count, failed_count, retest_count, blocked_count, untested_count. Other values: `plan_id`, `milestone_id`, `url`, `assignedto_id`, `description`, `refs`. Example: `[\"name\", \"failed_count\"]`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
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
    const createdAfter = this.createdAfter
      ? Math.floor(new Date(this.createdAfter).getTime() / 1000)
      : undefined;
    const {
      items, has_more, next_offset,
    } = await this.app.paginate({
      $,
      path: `get_runs/${this.projectId}`,
      key: "runs",
      params: {
        suite_id: this.suiteId,
        is_completed: this.isCompleted === undefined
          ? undefined
          : Number(this.isCompleted),
        created_after: createdAfter,
      },
      maxResults: this.maxResults ?? 10,
      offset: this.offset,
    });
    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const runs = items.map((r) => pluck({
      ...r,
      created_on: toIso(r.created_on),
    }, fields));
    $.export("$summary", `Found ${runs.length} run(s) in project ${this.projectId}`);
    return {
      runs,
      has_more,
      next_offset,
    };
  },
};
