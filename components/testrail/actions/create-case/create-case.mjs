import app from "../../testrail.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "testrail-create-case",
  name: "Create Case",
  description: "Create a test case in a TestRail section. Use **List Cases** first to avoid duplicating an existing case, and **List Sections** (or **Create Section**) for `sectionId`. Steps, expected results and preconditions live in instance-specific custom fields: call **List Metadata** with kind=case_fields to see the `system_name`s (commonly `custom_preconds`, `custom_steps`, `custom_expected`, or `custom_steps_separated` = a list of `{content, expected}`) and which are required, then pass them in `customFields`. `typeId` and `priorityId` come from **List Metadata** (case_types, priorities). Example: sectionId=410, title=\"Gate lockdown drill: gates close within 10s\", customFields=`{\"custom_steps_separated\": [{\"content\": \"Cut main power\", \"expected\": \"Gates start closing\"}], \"custom_expected\": \"All gates closed within 10s\"}` → returns the new case {id, title, section_id}. Common mistake: sending a custom field the template doesn't have, or omitting a required one (TestRail answers 400 naming it). [See the documentation](https://support.testrail.com/hc/en-us/articles/7077292642580-Cases#addcase)",
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
      description: "Section to create the case in. Use **List Sections** / **Create Section**.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Case title.",
    },
    typeId: {
      type: "integer",
      label: "Type ID",
      description: "Case type id (Functional, Regression, …). See **List Metadata** (kind=case_types).",
      optional: true,
    },
    priorityId: {
      type: "integer",
      label: "Priority ID",
      description: "Priority id. See **List Metadata** (kind=priorities).",
      optional: true,
    },
    estimate: {
      type: "string",
      label: "Estimate",
      description: "Time estimate as a timespan, e.g. `30s`, `1m 45s`.",
      optional: true,
    },
    refs: {
      type: "string",
      label: "References",
      description: "Comma-separated requirement/issue ids, e.g. `JP-12,JP-13`.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description: "JSON object of custom case fields by system name (steps, expected result, preconditions…). See **List Metadata** (kind=case_fields).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.addCase({
      $,
      sectionId: this.sectionId,
      data: {
        title: this.title,
        type_id: this.typeId,
        priority_id: this.priorityId,
        estimate: this.estimate,
        refs: this.refs,
        ...parseJson(this.customFields, "customFields"),
      },
    });
    $.export("$summary", `Created case ${response.id}: ${response.title}`);
    return response;
  },
};
