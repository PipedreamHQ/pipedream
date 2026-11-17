import app from "../../testrail.app.mjs";

export default {
  key: "testrail-create-case",
  name: "Create Case",
  description: "Creates a test case in a TestRail section. Use it when the user wants new tests written for a feature; run **List Cases** first to avoid duplicates and **List Sections** to get the section ID. To change an existing case use **Update Case**. Steps and expected results go in `customFields` (for example `custom_steps_separated`), and TestRail silently drops separated steps unless `templateId` is the \"Test Case (Steps)\" template, so look that ID up with **Get Reference Data** (`referenceType` = `templates`) first. Some instances mark custom fields as required; check **Get Reference Data** (`case_fields`) when TestRail rejects the call. Returns the new case's id, title, section_id and priority_id. Example: sectionId=78, title=\"Gate lock drill\", priorityId=3, templateId=2, customFields={\"custom_steps_separated\":[{\"content\":\"Trigger alarm\",\"expected\":\"Sirens sound\"}]} → the created case with its id. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    sectionId: {
      propDefinition: [
        app,
        "sectionId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the test case, e.g. `Expired ticket is rejected at the gate`.",
    },
    typeId: {
      type: "integer",
      label: "Type ID",
      description: "Case type ID, e.g. 6 for Functional. Use **Get Reference Data** with `referenceType` = `case_types`.",
      optional: true,
    },
    priorityId: {
      type: "integer",
      label: "Priority ID",
      description: "Priority ID. Defaults: 1 Low, 2 Medium, 3 High, 4 Critical. Use **Get Reference Data** with `referenceType` = `priorities`.",
      optional: true,
    },
    estimate: {
      type: "string",
      label: "Estimate",
      description: "Time estimate in TestRail's timespan format, e.g. `30s`, `1m 45s` or `2h`.",
      optional: true,
    },
    refs: {
      type: "string",
      label: "References",
      description: "Comma-separated requirement or ticket references, e.g. `INTC-443,JP-12`.",
      optional: true,
    },
    templateId: {
      type: "integer",
      label: "Template ID",
      description: "Case template ID. Required to store `custom_steps_separated`: use the ID of the template named \"Test Case (Steps)\" (2 on a default instance). Use **Get Reference Data** with `referenceType` = `templates`.",
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
      path: `add_case/${this.sectionId}`,
      data: {
        ...this.app.cleanParams({
          title: this.title,
          type_id: this.typeId,
          priority_id: this.priorityId,
          estimate: this.estimate,
          refs: this.refs,
          template_id: this.templateId,
        }),
        ...(this.customFields ?? {}),
      },
    });
    $.export("$summary", `Created case ${testCase.id}: ${testCase.title}`);
    return {
      id: testCase.id,
      title: testCase.title,
      section_id: testCase.section_id,
      suite_id: testCase.suite_id,
      priority_id: testCase.priority_id,
      type_id: testCase.type_id,
    };
  },
};
