import app from "../../testrail.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "testrail-update-case",
  name: "Update Case",
  description: "Partially update a TestRail test case: only the fields you pass change. Use **Get Case** first when you need the current values (for example before editing steps), and **List Cases** to find the id. Change steps, expected result or other custom fields through `customFields` (see **List Metadata** kind=case_fields for the names). Example: caseId=301, title=\"Verify paddock fence voltage alarm (reviewed)\", priorityId=4 → returns the updated case. Note: sending `custom_steps_separated` replaces the whole step list, so include all steps. Does not move a case between sections. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077292642580-Cases#updatecase)",
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
      description: "Case to update (from **List Cases**).",
    },
    title: {
      type: "string",
      label: "Title",
      description: "New title. Omit to keep the current one.",
      optional: true,
    },
    typeId: {
      type: "integer",
      label: "Type ID",
      description: "New case type id (**List Metadata** kind=case_types).",
      optional: true,
    },
    priorityId: {
      type: "integer",
      label: "Priority ID",
      description: "New priority id (**List Metadata** kind=priorities).",
      optional: true,
    },
    estimate: {
      type: "string",
      label: "Estimate",
      description: "New estimate as a timespan, e.g. `1m 45s`.",
      optional: true,
    },
    refs: {
      type: "string",
      label: "References",
      description: "New comma-separated references (replaces existing).",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description: "JSON object of custom case fields to change, by system name.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      title: this.title,
      type_id: this.typeId,
      priority_id: this.priorityId,
      estimate: this.estimate,
      refs: this.refs,
      ...parseJson(this.customFields, "customFields"),
    };
    if (Object.values(data).every((v) => v === undefined)) {
      throw new Error("Pass at least one field to change");
    }
    const response = await this.app.updateCase({
      $,
      caseId: this.caseId,
      data,
    });
    $.export("$summary", `Updated case ${response.id}: ${response.title}`);
    return response;
  },
};
