import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "title",
  "status_id",
  "case_id",
  "run_id",
  "assignedto_id",
  "priority_id",
  "type_id",
];

export default {
  key: "testrail-list-tests",
  name: "List Tests",
  description: "List the tests in a TestRail run, optionally only those with certain statuses. A test is one case inside one run, and its `id` (the test id) is what **Add Result**, **Get Test** and **Get Results For Test** take; `case_id` is the underlying case."
    + " This is the entry point for failure triage: pass `statusIds=[\"Failed\",\"Retest\"]` to get only the tests that need attention, then call **Get Results For Test** for the failure comment."
    + " Find the run with **List Runs** first if you only know its name. `statusIds` accepts status ids (5) or labels (\"Failed\"); built-in: 1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed (custom statuses: use **Get Metadata**)."
    + " Returns `{ total, truncated, tests }`; default `limit` 250 (max 1000), compact default fields, `fields` to change them (`id` is always included)."
    + " Example: to see what failed in run 540, call with runId=540, statusIds=[\"Failed\"] → returns `{ tests: [{ id: 3659, title: \"Electric fence failover\", status_id: 5, case_id: 801, run_id: 540 }] }`."
    + " [See the documentation](https://support.testrail.com/hc/en-us/articles/7077874763540-Tests)",
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
    runId: {
      propDefinition: [
        app,
        "runId",
      ],
    },
    statusIds: {
      type: "string[]",
      label: "Statuses",
      description: "Only tests currently in these statuses. Status ids or labels, e.g. `[\"Failed\",\"Retest\"]` or `[\"5\",\"4\"]`. Omit for all statuses.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum tests to return (default 250, max 1000).",
      optional: true,
      min: 1,
      max: 1000,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: `Test fields to return (\`id\` is always included). Default: ${DEFAULT_FIELDS.join(", ")}. Others: estimate, refs, milestone_id, custom_preconds, custom_steps_separated, custom_expected.`,
      optional: true,
    },
  },
  async run({ $ }) {
    const statusIds = this.statusIds?.length
      ? await Promise.all(this.statusIds.map((s) => this.app.resolveStatusId(s)))
      : undefined;
    const {
      items, truncated,
    } = await this.app.paginate({
      endpoint: `get_tests/${this.runId}`,
      params: {
        status_id: utils.csv(statusIds),
      },
      collection: "tests",
      limit: Math.min(this.limit || 250, 1000),
    });
    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const tests = items.map((test) => utils.pluck(test, fields));
    $.export("$summary", `Found ${tests.length} test${tests.length === 1
      ? ""
      : "s"} in run ${this.runId}`);
    return {
      total: tests.length,
      truncated,
      tests,
    };
  },
};
