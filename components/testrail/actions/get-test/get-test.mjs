import app from "../../testrail.app.mjs";

export default {
  key: "testrail-get-test",
  name: "Get Test",
  description: "Get one TestRail test (a case inside a run) by test id: title, `case_id`, `run_id`, current `status_id`, assignee and the case's custom fields. Use when you already have a test id (from **List Tests**); to see why it failed, call **List Results** with the same id. For the case definition itself (steps, section), call **Get Case** with `case_id`. Example: testId=5012 → returns {id: 5012, title: \"Verify paddock fence voltage alarm\", status_id: 5, case_id: 301, run_id: 88}. Common mistake: passing a case id instead of a test id. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077874763156-Tests)",
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
      description: "Numeric test id (not a case id). Get it from **List Tests**.",
    },
  },
  async run({ $ }) {
    const test = await this.app.getTest({
      $,
      testId: this.testId,
    });
    $.export("$summary", `Got test ${test.id}: ${test.title}`);
    return test;
  },
};
