import app from "../../testrail.app.mjs";

const DEFAULT_FIELDS = [
  "case_id",
  "title",
  "status_id",
  "run_id",
  "assignedto_id",
  "priority_id",
  "refs",
];

export default {
  key: "testrail-list-tests",
  name: "List Tests",
  description: "List the tests in a TestRail run, optionally only those with certain statuses. Use it for \"which tests failed in run X\" and to get the test ID needed for **Get Results** or **Add Result**. For a run's pass/fail totals without the tests, use **List Runs**; for one test's failure comment and history, use **Get Results**. A test's status is its latest result. Returns up to `maxResults` tests with id, case_id, title, status_id, status (name), run_id and assignee, plus `truncated` when more exist. Example: runId=53, statuses=[\"Failed\", \"Retest\"] → the failed and retest tests with their ids and titles. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      type: "integer",
      label: "Run ID",
      description: "The numeric ID of the test run, e.g. `53`. Use **List Runs** to find it by name.",
    },
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Only return tests in these statuses, given as names or ids, e.g. `[\"Failed\", \"Retest\"]` or `[\"5\", \"4\"]`. Defaults are Passed (1), Blocked (2), Untested (3), Retest (4), Failed (5); use **Get Configuration** for custom ones. Leave empty for all.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Test fields to return, e.g. `[\"title\", \"status_id\"]`. `id` is always included. Defaults to: case_id, title, status_id, run_id, assignedto_id, priority_id, refs. Other fields include assignedto_id, estimate, labels and custom_* fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    const statusIds = await this.app.resolveStatusList($, this.statuses);
    const params = {};
    if (statusIds) params.status_id = statusIds;
    const {
      items, truncated,
    } = await this.app.paginate({
      $,
      endpoint: `get_tests/${this.runId}`,
      key: "tests",
      params,
      maxResults: this.maxResults,
    });
    const statuses = await this.app._makeRequest({
      $,
      endpoint: "get_statuses",
    });
    const names = Object.fromEntries(statuses.map((s) => [
      s.id,
      s.label,
    ]));
    const tests = items.map((t) => ({
      ...this.app.shape(t, this.fields, DEFAULT_FIELDS),
      status: names[t.status_id],
    }));
    $.export("$summary", `Found ${tests.length} test(s) in run ${this.runId}${truncated
      ? " (more exist)"
      : ""}`);
    return {
      tests,
      count: tests.length,
      truncated,
    };
  },
};
