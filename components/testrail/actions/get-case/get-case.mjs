import app from "../../testrail.app.mjs";

export default {
  key: "testrail-get-case",
  name: "Get Case",
  description: "Get one TestRail test case by id with everything on it: title, section, priority, type, estimate, refs and all custom fields (steps, expected result, preconditions — keys like `custom_steps_separated`). Use after **List Cases** (or with a test's `case_id` from **List Tests**) when you need the full definition, and before **Update Case** to see current values. Example: caseId=301 → returns {id: 301, title: \"Verify paddock fence voltage alarm\", section_id: 410, priority_id: 3, custom_steps_separated: [...]}. Common mistake: passing a test id (run-specific) instead of a case id. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077292642580-Cases)",
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
      type: "integer",
      label: "Case ID",
      description: "Numeric case id (not a test id). Get it from **List Cases**.",
    },
  },
  async run({ $ }) {
    const testCase = await this.app.getCase({
      $,
      caseId: this.caseId,
    });
    $.export("$summary", `Got case ${testCase.id}: ${testCase.title}`);
    return testCase;
  },
};
