import app from "../../testrail.app.mjs";

export default {
  key: "testrail-create-case",
  name: "Create Case",
  description: "Create a test case in a section. Use it when writing tests for a new feature or turning a described scenario into a TestRail case. If the user hasn't said which project, section or what the case should test, ask them instead of guessing. Check **List Cases** first for an existing case with the same title, and find the section with **List Sections**; to change an existing case use **Update Case** instead. Steps and expected results live in custom fields such as `custom_steps_separated`, and some instances insist on certain custom fields, so use **Get Configuration** with `case_fields` to see them. Returns the new case's id, title, section_id, suite_id, priority_id and type_id. Example: sectionId=74, title=\"Alarm fires above 38C\", priority=\"High\", customFields={\"custom_steps_separated\": [{\"content\": \"Heat to 39C\", \"expected\": \"Alarm sounds\"}]} → {id: 1200, title: \"Alarm fires above 38C\"}. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      type: "integer",
      label: "Section ID",
      description: "The numeric ID of the section to put the case in, e.g. `74`. Use **List Sections** to find it, or **Create Section** to make one.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The case's title, e.g. `Alarm fires above 38C`.",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority as a name or id, e.g. `High` or `3`. Defaults are Low (1), Medium (2), High (3), Critical (4). Leave empty for the instance default.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The case type as a name or id, e.g. `Functional` or `6`. Use **Get Configuration** with `case_types` to list them. Leave empty for the instance default.",
      optional: true,
    },
    refs: {
      type: "string",
      label: "References",
      description: "Requirement or ticket IDs, comma-separated, e.g. `INTC-12,INTC-13`.",
      optional: true,
    },
    estimate: {
      type: "string",
      label: "Estimate",
      description: "Estimated effort as a TestRail timespan, e.g. `30s` or `1m 45s`.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description: "JSON object of custom case fields keyed by system name, e.g. `{\"custom_preconds\": \"Incubator powered on\", \"custom_steps_separated\": [{\"content\": \"Heat to 39C\", \"expected\": \"Alarm sounds\"}]}`. Use **Get Configuration** with `case_fields` to list the names and types.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      title: this.title,
      ...this.app.parseJsonObject(this.customFields, "customFields"),
    };
    const priorityId = await this.app.resolvePriority($, this.priority);
    const typeId = await this.app.resolveCaseType($, this.type);
    if (priorityId) data.priority_id = priorityId;
    if (typeId) data.type_id = typeId;
    if (this.refs) data.refs = this.refs;
    if (this.estimate) data.estimate = this.estimate;
    const created = await this.app._makeRequest({
      $,
      method: "POST",
      endpoint: `add_case/${this.sectionId}`,
      data,
    });
    $.export("$summary", `Created case ${created.id}: ${created.title}`);
    return this.app.shape(created, [], [
      "title",
      "section_id",
      "suite_id",
      "priority_id",
      "type_id",
      "refs",
      "created_on",
    ]);
  },
};
