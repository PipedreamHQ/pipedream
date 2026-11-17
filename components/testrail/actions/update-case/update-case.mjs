import app from "../../testrail.app.mjs";

export default {
  key: "testrail-update-case",
  name: "Update Case",
  description: "Updates fields of an existing TestRail test case; only the fields you pass change. Use it to retitle a case, change its priority or estimate, or rewrite its steps. To create a new case use **Create Case**; to record a pass/fail outcome use **Add Result**, because a case's run status is not stored on the case. Get the case ID from **List Cases**. Returns the updated case's id, title, priority_id, type_id, estimate and refs. Example: caseId=1339, estimate=\"5m\" → the case with estimate \"5m\". [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    caseId: {
      propDefinition: [
        app,
        "caseId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "New title for the case. Leave empty to keep the current one.",
      optional: true,
    },
    typeId: {
      type: "integer",
      label: "Type ID",
      description: "New case type ID. Use **Get Reference Data** with `referenceType` = `case_types`.",
      optional: true,
    },
    priorityId: {
      type: "integer",
      label: "Priority ID",
      description: "New priority ID (1 Low, 2 Medium, 3 High, 4 Critical by default).",
      optional: true,
    },
    estimate: {
      type: "string",
      label: "Estimate",
      description: "New time estimate, e.g. `30s`, `1m 45s` or `2h`.",
      optional: true,
    },
    refs: {
      type: "string",
      label: "References",
      description: "New comma-separated references, e.g. `INTC-443,JP-12`. Replaces the existing references.",
      optional: true,
    },
    customFields: {
      propDefinition: [
        app,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    const testCase = await this.app.post({
      $,
      path: `update_case/${this.caseId}`,
      data: {
        ...this.app.cleanParams({
          title: this.title,
          type_id: this.typeId,
          priority_id: this.priorityId,
          estimate: this.estimate,
          refs: this.refs,
        }),
        ...(this.customFields ?? {}),
      },
    });
    $.export("$summary", `Updated case ${testCase.id}`);
    return {
      id: testCase.id,
      title: testCase.title,
      priority_id: testCase.priority_id,
      type_id: testCase.type_id,
      estimate: testCase.estimate,
      refs: testCase.refs,
    };
  },
};
