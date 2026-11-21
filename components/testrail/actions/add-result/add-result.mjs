import app from "../../testrail.app.mjs";
import {
  parseObject, toIso,
} from "../../common/utils.mjs";

export default {
  key: "testrail-add-result",
  name: "Add Result",
  description: "Records a new result on a TestRail test: a status plus an optional comment, defects, elapsed time and version. Use it to log a pass or fail, or to record triage notes, because TestRail has no \"update test\" call and a test's status is simply its latest result. Not for several tests at once (call it once per test) and not for creating tests or cases (use **Create Case**). Get the test ID from **List Tests** and status IDs from **Get Statuses**. Returns the new result's id, test_id, status_id, comment, defects and created_on. Example: testId=4124, statusId=4, comment=\"Triaged: relay firmware suspected\", defects=\"JP-4521\" → the test shows Retest with that comment. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      propDefinition: [
        app,
        "testId",
      ],
    },
    statusId: {
      type: "integer",
      label: "Status ID",
      description: "The status to set. Defaults are 1 Passed, 2 Blocked, 4 Retest, 5 Failed (3 Untested cannot be set); instances may add custom statuses, so use **Get Statuses** when unsure. Example: `5`.",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Free-text note shown with the result, such as the failure reason or triage outcome. Example: `Triaged: relay firmware suspected, rerun after patch`.",
      optional: true,
    },
    defects: {
      type: "string",
      label: "Defects",
      description: "Comma-separated IDs of linked defects in your issue tracker. Example: `JP-4521,JP-4530`.",
      optional: true,
    },
    elapsed: {
      type: "string",
      label: "Elapsed Time",
      description: "Time the test took, as a timespan. Example: `30s`, `2m` or `1h 5m`.",
      optional: true,
    },
    version: {
      type: "string",
      label: "Version",
      description: "The software version or build the test ran against. Example: `2.4.1`.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Extra custom result fields as an object keyed by system name. Use **Get Custom Fields** with fieldType `result` to see the names. Example: `{\"custom_ai_input\": \"prompt text\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.addResult({
      $,
      testId: this.testId,
      data: {
        status_id: this.statusId,
        comment: this.comment,
        defects: this.defects,
        elapsed: this.elapsed,
        version: this.version,
        ...parseObject(this.customFields),
      },
    });
    $.export("$summary", `Added result ${response.id} (status ${response.status_id}) to test ${this.testId}`);
    return {
      id: response.id,
      test_id: response.test_id,
      status_id: response.status_id,
      comment: response.comment,
      defects: response.defects,
      created_on: toIso(response.created_on),
    };
  },
};
