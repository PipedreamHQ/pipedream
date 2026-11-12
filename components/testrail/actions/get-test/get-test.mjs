import app from "../../testrail.app.mjs";

export default {
  key: "testrail-get-test",
  name: "Get Test",
  description: "Get one TestRail test (a case inside a run) by its test ID: title, current status, assignee, priority, the `case_id` it was created from and the `run_id` it belongs to. Use it when you already have a test ID (from the user or from **List Tests**) and need its current state. To see why a test failed, use **Get Results for Test** instead; to record an outcome, use **Add Result**. Example: call with testId=98765 → returns {id: 98765, case_id: 4321, run_id: 345, title: \"Login works\", status_id: 5, ...}. Common mistake: passing a case ID or run ID; a test ID comes from **List Tests**. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077874763156-Tests)",
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
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      path: `get_test/${this.testId}`,
    });
    $.export("$summary", `Retrieved test ${response.id}: ${response.title}`);
    return response;
  },
};
