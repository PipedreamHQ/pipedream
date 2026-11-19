import app from "../../testrail.app.mjs";

const DEFAULT_FIELDS = [
  "test_id",
  "status_id",
  "comment",
  "defects",
  "version",
  "elapsed",
  "created_on",
  "created_by",
  "assignedto_id",
];

export default {
  key: "testrail-get-results",
  name: "Get Results",
  description: "Get the result history, newest first, of one test or of a whole run. Use it to read why a test failed (the tester's comment and defect links) and what happened before. Pass `testId` for one test's history, or `runId` for every result in a run, but not both. To list tests by status use **List Tests**; to record a new result use **Add Result**. Returns id, test_id, status_id, status (name), comment, defects, version, elapsed, created_on (ISO) and created_by. Example: testId=8812, statuses=[\"Failed\"] → [{status: \"Failed\", comment: \"Fence measured 6.2kV\", defects: \"GR-101\"}]. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    testId: {
      type: "integer",
      label: "Test ID",
      description: "The numeric test ID, e.g. `8812`, for one test's history. Use **List Tests** to find it. Give this or Run ID, not both.",
      optional: true,
    },
    runId: {
      type: "integer",
      label: "Run ID",
      description: "The numeric run ID, e.g. `53`, for every result recorded in that run. Use **List Runs** to find it. Give this or Test ID, not both.",
      optional: true,
    },
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Only return results with these statuses, as names or ids, e.g. `[\"Failed\"]`. Leave empty for all.",
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
      description: "Result fields to return, e.g. `[\"comment\", \"defects\"]`. `id` is always included. Defaults to: test_id, status_id, comment, defects, version, elapsed, created_on, created_by, assignedto_id. Other fields include assignedto_id and custom_* result fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (Boolean(this.testId) === Boolean(this.runId)) {
      throw new Error("Provide exactly one of testId or runId.");
    }
    const statusIds = await this.app.resolveStatusList($, this.statuses);
    const params = {};
    if (statusIds) params.status_id = statusIds;
    const {
      items, truncated,
    } = await this.app.paginate({
      $,
      endpoint: this.testId
        ? `get_results/${this.testId}`
        : `get_results_for_run/${this.runId}`,
      key: "results",
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
    const results = items.map((r) => ({
      ...this.app.shape(r, this.fields, DEFAULT_FIELDS),
      status: names[r.status_id],
    }));
    $.export("$summary", `Found ${results.length} result(s)${truncated
      ? " (more exist)"
      : ""}`);
    return {
      results,
      count: results.length,
      truncated,
    };
  },
};
