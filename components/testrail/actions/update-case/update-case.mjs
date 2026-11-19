import app from "../../testrail.app.mjs";

export default {
  key: "testrail-update-case",
  name: "Update Case",
  description: "Change an existing test case: its title, priority, type, references, estimate or custom fields such as steps. Only the inputs you provide change; everything else stays as it is. Use **Get Case** first to see the current values, and use **Create Case** instead for a new case. Overwrites the previous values and cannot be undone from here, so confirm with the user before changing many cases at once or replacing existing titles or steps. Returns the updated case's id, title, section_id, priority_id and type_id. Example: caseId=1064, priority=\"Critical\" → {id: 1064, priority_id: 4}. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      type: "integer",
      label: "Case ID",
      description: "The numeric ID of the case to change, e.g. `1064`. Use **List Cases** to find it.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The new title, e.g. `Gate lock engages within 2 seconds`.",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The new priority as a name or id, e.g. `Critical` or `4`. Defaults are Low (1), Medium (2), High (3), Critical (4).",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The new case type as a name or id, e.g. `Regression`. Use **Get Configuration** with `case_types` to list them.",
      optional: true,
    },
    refs: {
      type: "string",
      label: "References",
      description: "Requirement or ticket IDs, comma-separated, replacing the current ones, e.g. `INTC-12,INTC-13`.",
      optional: true,
    },
    estimate: {
      type: "string",
      label: "Estimate",
      description: "Estimated effort as a TestRail timespan, e.g. `1m 45s`.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description: "JSON object of custom case fields to change, keyed by system name, e.g. `{\"custom_preconds\": \"Gate powered on\"}`. Use **Get Configuration** with `case_fields` to list the names.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      ...this.app.parseJsonObject(this.customFields, "customFields"),
    };
    if (this.title) data.title = this.title;
    const priorityId = await this.app.resolvePriority($, this.priority);
    const typeId = await this.app.resolveCaseType($, this.type);
    if (priorityId) data.priority_id = priorityId;
    if (typeId) data.type_id = typeId;
    if (this.refs !== undefined) data.refs = this.refs;
    if (this.estimate) data.estimate = this.estimate;
    if (!Object.keys(data).length) {
      throw new Error("Provide at least one field to change.");
    }
    const updated = await this.app._makeRequest({
      $,
      method: "POST",
      endpoint: `update_case/${this.caseId}`,
      data,
    });
    $.export("$summary", `Updated case ${updated.id}: ${updated.title}`);
    return this.app.shape(updated, [], [
      "title",
      "section_id",
      "suite_id",
      "priority_id",
      "type_id",
      "refs",
      "updated_on",
    ]);
  },
};
