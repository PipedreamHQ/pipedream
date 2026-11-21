import app from "../../testrail.app.mjs";
import {
  nonNullCustomFields, toIso,
} from "../../common/utils.mjs";

export default {
  key: "testrail-get-test",
  name: "Get Test",
  description: "Gets one test from a TestRail run by its test ID. Use it when you already have a test ID (from **List Tests**) and need its current status, title, case ID or assignee. Not for finding tests (use **List Tests**) or for the comments and defects recorded on it (use **List Test Results**). The test ID is not the case ID. Returns id, case_id, run_id, title, status_id, assignedto_id, priority_id, type_id, refs, estimate and any filled-in custom fields. Example: testId=4124 → `{id: 4124, title: \"Electric fence trips at 10kV breach\", status_id: 5}`. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    const t = await this.app.getTest({
      $,
      testId: this.testId,
    });
    $.export("$summary", `Retrieved test ${t.id}: ${t.title}`);
    return {
      id: t.id,
      case_id: t.case_id,
      run_id: t.run_id,
      title: t.title,
      status_id: t.status_id,
      assignedto_id: t.assignedto_id,
      priority_id: t.priority_id,
      type_id: t.type_id,
      refs: t.refs,
      estimate: t.estimate,
      created_on: toIso(t.created_on),
      ...nonNullCustomFields(t),
    };
  },
};
