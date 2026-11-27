import app from "../../testrail.app.mjs";

export default {
  key: "testrail-add-result",
  name: "Add Result",
  description: "Record a new result (pass, fail, retest, ...) for one test. Use it to log triage or CI outcomes: TestRail has no \"update test\" call, because a test's status is simply its latest result. Identify the test with `testId` (from **List Tests**), or with `runId` plus `caseId` when you only know the case. To read earlier results use **Get Results**. Each call appends a result and cannot be undone. It cannot attach files or screenshots, so do not use it as a stand-in for an attachment; tell the user that is not supported. Returns the created result's id, test_id, status_id, comment and defects. Example: testId=8812, status=\"Retest\", comment=\"Flaky thermostat\", defects=\"GR-501\" → result with status_id 4. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    testId: {
      type: "integer",
      label: "Test ID",
      description: "The numeric test ID, e.g. `8812`. Use **List Tests** to find it. Give this, or Run ID together with Case ID.",
      optional: true,
    },
    runId: {
      type: "integer",
      label: "Run ID",
      description: "The numeric run ID, e.g. `53`. Use with Case ID when you don't have a test ID. Use **List Runs** to find it.",
      optional: true,
    },
    caseId: {
      type: "integer",
      label: "Case ID",
      description: "The numeric case ID, e.g. `1064`. Use with Run ID when you don't have a test ID. Use **List Cases** to find it.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The result status as a name, label or id, e.g. `Passed`, `Failed`, `Retest`, `Blocked` or `5`. Defaults are Passed (1), Blocked (2), Retest (4), Failed (5); use **Get Configuration** for custom statuses.",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Free-text note shown on the result, e.g. `Reproduced on rig 2, stack trace attached to GR-501`.",
      optional: true,
    },
    defects: {
      type: "string",
      label: "Defects",
      description: "Defect or issue IDs to link, comma-separated, e.g. `GR-501,GR-502`.",
      optional: true,
    },
    version: {
      type: "string",
      label: "Version",
      description: "The build or version tested, e.g. `v2.4.1`.",
      optional: true,
    },
    elapsed: {
      type: "string",
      label: "Elapsed",
      description: "Time spent as a TestRail timespan, e.g. `30s` or `1m 45s`.",
      optional: true,
    },
    assignedToId: {
      type: "integer",
      label: "Assigned To ID",
      description: "The user ID to assign the test to, e.g. `1`. Use **Get Current User** for your own ID.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description: "JSON object of custom result fields, keyed by system name, e.g. `{\"custom_step_results\": [{\"content\": \"Open page\", \"expected\": \"Loads\", \"actual\": \"Loads\", \"status_id\": 1}]}`. Use **Get Configuration** with `result_fields` to list the names.",
      optional: true,
    },
  },
  async run({ $ }) {
    const byTest = Boolean(this.testId);
    const byCase = Boolean(this.runId && this.caseId);
    if (byTest === byCase) {
      throw new Error("Provide either testId, or both runId and caseId.");
    }
    const data = {
      status_id: await this.app.resolveStatus($, this.status),
      ...this.app.parseJsonObject(this.customFields, "customFields"),
    };
    if (this.comment) data.comment = this.comment;
    if (this.defects) data.defects = this.defects;
    if (this.version) data.version = this.version;
    if (this.elapsed) data.elapsed = this.elapsed;
    if (this.assignedToId) data.assignedto_id = this.assignedToId;
    const result = await this.app._makeRequest({
      $,
      method: "POST",
      endpoint: byTest
        ? `add_result/${this.testId}`
        : `add_result_for_case/${this.runId}/${this.caseId}`,
      data,
    });
    $.export("$summary", `Recorded ${this.status} result ${result.id} for test ${result.test_id}`);
    return this.app.withIsoDates(result);
  },
};
