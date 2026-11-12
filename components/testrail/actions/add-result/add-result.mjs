import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "testrail-add-result",
  name: "Add Result",
  description: "Record a result on a TestRail test: set its status and optionally a comment, linked defects, version and elapsed time. TestRail has no \"update test\" call: a test's status IS its latest result, so this is how you mark a test Passed/Failed/Retest or save triage notes."
    + " Takes a test id (from **List Tests** or **Get Test**), not a case id. Find failing tests with **List Tests** (statusIds=[\"Failed\"]) and read the reason with **Get Results For Test** first."
    + " `resultStatus` accepts an id or label: 1 Passed, 2 Blocked, 4 Retest, 5 Failed (custom statuses: see **Get Metadata**). `defects` is a comma-separated list of tracker ids like `JIRA-4821,JIRA-4822`. `elapsed` is a timespan such as `30s` or `1m 45s`."
    + " Instance-specific result fields go in `customFields` as a JSON object keyed by field `system_name` (see **Get Metadata** `resultFields`), e.g. `{\"custom_step_results\":[...]}`."
    + " Adds a new entry each time (history is append-only); it cannot be undone from here. Do NOT guess the target: when the request does not identify exactly one test (for example several runs contain a test with that name, or no run is named), look up the candidates and ask the user which run/test they mean before calling this."
    + " Example: testId=3659, resultStatus=\"Failed\", comment=\"Backup generator relay stuck\", defects=\"JIRA-4821\" → returns the new result `{ id, test_id: 3659, status_id: 5, comment, defects }`."
    + " [See the documentation](https://support.testrail.com/hc/en-us/articles/7077819312660-Results)",
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
    resultStatus: {
      type: "string",
      label: "Status",
      description: "Status id or label: `Passed` (1), `Blocked` (2), `Retest` (4), `Failed` (5), or a custom status label/id.",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Free-text comment, e.g. the triage conclusion or failure reason.",
      optional: true,
    },
    defects: {
      type: "string",
      label: "Defects",
      description: "Comma-separated defect ids from your bug tracker, e.g. `JIRA-4821`.",
      optional: true,
    },
    version: {
      type: "string",
      label: "Version",
      description: "Version or build the test ran against, e.g. `2.14.0`.",
      optional: true,
    },
    elapsed: {
      type: "string",
      label: "Elapsed",
      description: "Time taken as a timespan: `30s`, `1m 45s`, `2h`.",
      optional: true,
    },
    assignedToId: {
      type: "integer",
      label: "Assign To (User ID)",
      description: "Assign the test to this TestRail user id after recording the result.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description: "JSON object of custom result fields keyed by `system_name`, e.g. `{\"custom_step_results\":[{\"content\":\"Step 1\",\"expected\":\"OK\",\"actual\":\"OK\",\"status_id\":1}]}`. See **Get Metadata** (`resultFields`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const statusId = await this.app.resolveStatusId(this.resultStatus);
    const result = await this.app._makeRequest({
      endpoint: `add_result/${this.testId}`,
      method: "POST",
      data: {
        status_id: statusId,
        comment: this.comment,
        defects: this.defects,
        version: this.version,
        elapsed: this.elapsed,
        assignedto_id: this.assignedToId,
        ...utils.parseJson(this.customFields, "customFields"),
      },
    });
    $.export("$summary", `Recorded status ${statusId} on test ${this.testId}`);
    return {
      id: result.id,
      test_id: result.test_id,
      status_id: result.status_id,
      comment: result.comment,
      defects: result.defects,
      version: result.version,
      elapsed: result.elapsed,
      assignedto_id: result.assignedto_id,
      created_on: result.created_on,
    };
  },
};
