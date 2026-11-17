import app from "../../testrail.app.mjs";

export default {
  key: "testrail-get-case",
  name: "Get Case",
  description: "Gets one TestRail test case by ID, including its steps, expected results and every custom field. Use it when the user gives a case ID (like C1065) or you need the full content of a case you found with **List Cases**. To search for cases use **List Cases**; to see a case's status inside a run use **List Tests**. Returns the case object: id, title, section_id, suite_id, priority_id, type_id, estimate, refs and custom_* fields such as custom_steps_separated. Example: caseId=1065 → the case \"Electric fence failover\" with priority_id 4. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    caseId: {
      propDefinition: [
        app,
        "caseId",
      ],
    },
  },
  async run({ $ }) {
    const testCase = await this.app.get({
      $,
      path: `get_case/${this.caseId}`,
    });
    $.export("$summary", `Fetched case ${testCase.id}: ${testCase.title}`);
    return testCase;
  },
};
