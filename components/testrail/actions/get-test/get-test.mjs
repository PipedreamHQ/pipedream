import app from "../../testrail.app.mjs";

export default {
  key: "testrail-get-test",
  name: "Get Test",
  description: "Gets one TestRail test by its test ID: its current status, the case it instantiates and the run it belongs to. Use it when the user gives a test ID (like T3659) and wants its state. To see all tests of a run use **List Tests**; to read the failure comment or history use **List Results**; for the case's steps use **Get Case**. Returns id, case_id, run_id, title, status_id, assignedto_id and priority_id. Example: testId=3659 → status_id 5 (Failed), case_id 1065, run_id 54. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    const test = await this.app.get({
      $,
      path: `get_test/${this.testId}`,
    });
    $.export("$summary", `Fetched test ${test.id}: ${test.title}`);
    return {
      id: test.id,
      case_id: test.case_id,
      run_id: test.run_id,
      title: test.title,
      status_id: test.status_id,
      assignedto_id: test.assignedto_id,
      priority_id: test.priority_id,
    };
  },
};
