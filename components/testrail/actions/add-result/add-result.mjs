import app from "../../testrail.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "testrail-add-result",
  name: "Add Result",
  description: "Record a result (Passed, Failed, Retest, …) on ONE test — this is how you triage or update a test, because TestRail has no \"update test\": a test's status is simply its latest result. Identify the test either by `testId` (from **List Tests**) or by `runId` + `caseId` when you only know the case. Use **List Metadata** (kind=statuses) for `statusId` (defaults: 1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed) and (kind=result_fields) for custom result fields. For many cases at once (CI reporting) use **Add Results For Cases**. Results cannot be deleted, so check ids first. Example: testId=5012, statusId=5, comment=\"Voltage alarm did not trigger within 5s\", defects=\"JP-142\" → returns the new result {id, test_id, status_id, comment}. `elapsed` is a timespan like \"30s\" or \"1m 45s\"; `customFields` is a JSON object string like `{\"custom_browser\": \"Chrome\"}`. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077819312404-Results#addresult)",
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
      description: "Test to record the result on (from **List Tests**). Set this OR `runId` + `caseId`.",
      optional: true,
    },
    runId: {
      type: "integer",
      label: "Run ID",
      description: "Run containing the case. Use together with `caseId` when you have no test id.",
      optional: true,
    },
    caseId: {
      type: "integer",
      label: "Case ID",
      description: "Case to record the result for, in run `runId`.",
      optional: true,
    },
    statusId: {
      type: "integer",
      label: "Status ID",
      description: "Result status id, e.g. 1 Passed, 2 Blocked, 4 Retest, 5 Failed. Confirm with **List Metadata** (kind=statuses); custom statuses have other ids.",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Free text explaining the result, e.g. the triage conclusion.",
      optional: true,
    },
    defects: {
      type: "string",
      label: "Defects",
      description: "Comma-separated defect ids from your issue tracker, e.g. `JP-142,JP-150`.",
      optional: true,
    },
    elapsed: {
      type: "string",
      label: "Elapsed",
      description: "Time spent, as a TestRail timespan: `30s`, `1m 45s`, `2h`.",
      optional: true,
    },
    assignedToId: {
      type: "integer",
      label: "Assign To (User ID)",
      description: "User to assign the test to. Use **Get User** to find an id.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description: "JSON object of custom result fields, keyed by system name, e.g. `{\"custom_browser\": \"Chrome\"}`. Find names with **List Metadata** (kind=result_fields).",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.testId && !(this.runId && this.caseId)) {
      throw new Error("Provide testId, or both runId and caseId");
    }
    const data = {
      status_id: this.statusId,
      comment: this.comment,
      defects: this.defects,
      elapsed: this.elapsed,
      assignedto_id: this.assignedToId,
      ...parseJson(this.customFields, "customFields"),
    };
    const response = this.testId
      ? await this.app.addResult({
        $,
        testId: this.testId,
        data,
      })
      : await this.app.addResultForCase({
        $,
        runId: this.runId,
        caseId: this.caseId,
        data,
      });
    $.export("$summary", `Added result ${response.id} (status ${this.statusId}) to ${this.testId
      ? `test ${this.testId}`
      : `case ${this.caseId} in run ${this.runId}`}`);
    return response;
  },
};
