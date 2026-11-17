import app from "../../testrail.app.mjs";

export default {
  key: "testrail-add-result",
  name: "Add Result",
  description: "Records a result (status plus comment) on ONE TestRail test. TestRail has no update-test call: a test's status is its latest result, so use this to triage, pass, fail or retest a test. Identify the test with `testId` (from **List Tests**), or with `runId` and `caseId` together. To report many tests at once use **Add Results**. Status IDs: 1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed by default; instances can add more (see **Get Reference Data**). Returns the new result's id, test_id, status_id, comment and defects. Example: testId=3659, statusId=4, comment=\"Sensor flaky, retest after firmware\" → result recorded, test now Retest. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    statusId: {
      type: "integer",
      label: "Status ID",
      description: "Status to record. Defaults: 1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed. Use **Get Reference Data** with `referenceType` = `statuses` for custom ones.",
    },
    testId: {
      type: "integer",
      label: "Test ID",
      description: "The test to record the result on (from **List Tests**; it is not the case ID). Leave empty when using `runId` and `caseId`.",
      optional: true,
    },
    runId: {
      propDefinition: [
        app,
        "runId",
      ],
      description: "With `caseId`: the run to record the result in, instead of a test ID.",
      optional: true,
    },
    caseId: {
      propDefinition: [
        app,
        "caseId",
      ],
      description: "With `runId`: the case to record the result for, instead of a test ID.",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Free-text comment, e.g. the failure reason or triage note.",
      optional: true,
    },
    defects: {
      type: "string",
      label: "Defects",
      description: "Comma-separated defect IDs from your issue tracker, e.g. `JP-101,JP-102`.",
      optional: true,
    },
    version: {
      type: "string",
      label: "Version",
      description: "Build or version tested, e.g. `2.4.1`.",
      optional: true,
    },
    elapsed: {
      type: "string",
      label: "Elapsed",
      description: "Time taken, in TestRail's timespan format, e.g. `30s` or `1m 45s`.",
      optional: true,
    },
    assignedtoId: {
      type: "integer",
      label: "Assign To User ID",
      description: "Assign the test to this user. Use **List Users** to find the ID.",
      optional: true,
    },
    customFields: {
      propDefinition: [
        app,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    let path;
    if (this.testId && !this.runId && !this.caseId) path = `add_result/${this.testId}`;
    else if (this.runId && this.caseId && !this.testId) path = `add_result_for_case/${this.runId}/${this.caseId}`;
    else throw new Error("Pass either testId, or both runId and caseId");
    const result = await this.app.post({
      $,
      path,
      data: {
        ...this.app.cleanParams({
          status_id: this.statusId,
          comment: this.comment,
          defects: this.defects,
          version: this.version,
          elapsed: this.elapsed,
          assignedto_id: this.assignedtoId,
        }),
        ...(this.customFields ?? {}),
      },
    });
    $.export("$summary", `Recorded result ${result.id} (status ${result.status_id}) on test ${result.test_id}`);
    return {
      id: result.id,
      test_id: result.test_id,
      status_id: result.status_id,
      comment: result.comment,
      defects: result.defects,
    };
  },
};
