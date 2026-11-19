import app from "../../testrail.app.mjs";

export default {
  key: "testrail-get-test",
  name: "Get Test",
  description: "Get one test (a case inside a run) by its test ID. Use it to check a test's current status, assignee or title when you already have the test ID. To find test IDs, use **List Tests**; to see why it failed and its history, use **Get Results** instead. Returns the test's id, case_id, run_id, title, status_id, assignedto_id, priority_id and custom fields, plus the status name. Example: testId=8812 → {id: 8812, title: \"Fence holds 9kV\", status_id: 5, status: \"Failed\", run_id: 53}. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      description: "The numeric test ID, e.g. `8812`. This is NOT the case ID. Use **List Tests** to find it.",
    },
  },
  async run({ $ }) {
    const test = await this.app._makeRequest({
      $,
      endpoint: `get_test/${this.testId}`,
    });
    const statuses = await this.app._makeRequest({
      $,
      endpoint: "get_statuses",
    });
    const status = statuses.find((s) => s.id === test.status_id)?.label;
    $.export("$summary", `Test ${test.id}: ${test.title} (${status})`);
    return {
      ...test,
      status,
    };
  },
};
