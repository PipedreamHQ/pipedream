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
  "custom_preconds",
  "custom_steps_separated",
  "custom_expected",
];

export default {
  key: "testrail-get-test",
  name: "Get Test",
  description: "Fetch one TestRail test by its test id: title, current `status_id`, the underlying `case_id`, the `run_id` it belongs to, assignee, priority and the case's steps."
    + " Use when you already have a test id (from **List Tests**, a link or a user) and need its current state before recording a result with **Add Result**. For the failure comment and history use **Get Results For Test**; to browse many tests use **List Tests**."
    + " A test id is not a case id: tests exist per run. `status_id` 1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed (see **Get Metadata** for custom statuses)."
    + " Example: testId=3659 → returns `{ id: 3659, title: \"Electric fence failover\", status_id: 5, case_id: 801, run_id: 540 }`."
    + " Pass `fields` to return different fields (`id` is always included)."
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
    testId: {
      propDefinition: [
        app,
        "testId",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: `Test fields to return (\`id\` is always included). Default: ${DEFAULT_FIELDS.join(", ")}.`,
      optional: true,
    },
  },
  async run({ $ }) {
    const test = await this.app._makeRequest({
      endpoint: `get_test/${this.testId}`,
    });
    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    $.export("$summary", `Fetched test ${this.testId}: ${test.title}`);
    return utils.pluck(test, fields);
  },
};
