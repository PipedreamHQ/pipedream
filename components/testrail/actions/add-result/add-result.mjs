import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "testrail-add-result",
  name: "Add Result",
  description: "Record a result on a TestRail test: this is how a test's status is changed or triaged, because TestRail has no \"update test\" call and a test's status is simply its latest result. Use it to mark a test Passed/Failed/Retest/Blocked, attach a triage comment and link defects. Get the TEST ID (not the case ID) from **List Tests**, and the status ID from **Get Metadata** (resource `statuses`; by default 1 Passed, 2 Blocked, 4 Retest, 5 Failed). If the instance has required or custom result fields, pass them as customFields using the `custom_*` names from **Get Metadata** (resource `result_fields`). Only call it when the request identifies exactly one test (or a clearly scoped set): if the user did not say which project or run, and the same case appears in several runs, ask them first instead of guessing. Every call appends a new result and cannot be undone through the API, so only call it for tests the user named or clearly scoped. Example: to mark test 98765 as Retest after triage, call with testId=98765, statusId=4, comment=\"Triaged: flaky hydraulics\", defects=\"JP-5000\" → returns the new result with id, test_id, status_id, comment. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077819312404-Results)",
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
      description: "The status to record. Defaults: 1 Passed, 2 Blocked, 4 Retest, 5 Failed (3 Untested cannot be set). Use **Get Metadata** (resource `statuses`) for the instance's IDs, including custom statuses.",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Free-text note for the result, e.g. the failure reason or triage conclusion.",
      optional: true,
    },
    defects: {
      type: "string",
      label: "Defects",
      description: "Linked defect IDs, comma-separated, e.g. `JP-5000` or `JP-5000,JP-5001`.",
      optional: true,
    },
    elapsed: {
      type: "string",
      label: "Elapsed Time",
      description: "Time spent, as a TestRail timespan such as `30s`, `2m` or `1h 5m`.",
      optional: true,
    },
    version: {
      type: "string",
      label: "Version",
      description: "Software version or build the test ran against, e.g. `2.4.1`.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Result Fields",
      description: "JSON object of custom result fields keyed by system name, e.g. `{\"custom_environment\": \"staging\"}`. See **Get Metadata** (resource `result_fields`) for valid names and required fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      status_id: this.statusId,
      ...utils.parseJsonObject(this.customFields, "customFields"),
    };
    if (this.comment !== undefined) data.comment = this.comment;
    if (this.defects !== undefined) data.defects = this.defects;
    if (this.elapsed !== undefined) data.elapsed = this.elapsed;
    if (this.version !== undefined) data.version = this.version;
    const response = await this.app._makeRequest({
      $,
      path: `add_result/${this.testId}`,
      method: "POST",
      data,
    });
    $.export("$summary", `Added result ${response.id} (status ${response.status_id}) to test ${this.testId}`);
    return response;
  },
};
