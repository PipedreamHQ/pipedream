import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "testrail-add-case",
  name: "Add Case",
  description: "Create a test case in a TestRail section. Use it to turn a described test (title, preconditions, steps, expected results) into a case in the repository. Get the section ID from **List Sections** (create one with **Add Section** if needed) and check **List Cases** first to avoid duplicates. Steps, preconditions and expected results are custom fields whose names depend on the case template, e.g. `custom_preconds`, `custom_steps` / `custom_expected`, or `custom_steps_separated` (a list of {content, expected} objects); read the exact names, types and required flags with **Get Metadata** (resource `case_fields`) and pass them in customFields, because instances often make some of them required. Example: call with sectionId=77, title=\"Main gate lock survives power loss\", priorityId=2, customFields={\"custom_preconds\": \"Gate closed\", \"custom_steps_separated\": [{\"content\": \"Cut power\", \"expected\": \"Gate stays locked\"}]} → returns the new case with id, title, section_id, suite_id. Common mistake: guessing custom field names instead of reading them. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077292642580-Cases)",
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
      description: "Title of the test case.",
    },
    templateId: {
      type: "integer",
      label: "Template ID",
      description: "Case template ID (decides which step fields exist). See **Get Metadata** (resource `templates`). Omit for the project default.",
      optional: true,
    },
    typeId: {
      type: "integer",
      label: "Type ID",
      description: "Case type ID, e.g. Functional or Regression. See **Get Metadata** (resource `case_types`).",
      optional: true,
    },
    priorityId: {
      type: "integer",
      label: "Priority ID",
      description: "Priority ID. See **Get Metadata** (resource `priorities`).",
      optional: true,
    },
    estimate: {
      type: "string",
      label: "Estimate",
      description: "Time estimate as a TestRail timespan such as `30s`, `5m` or `1h 30m`.",
      optional: true,
    },
    refs: {
      type: "string",
      label: "References",
      description: "Comma-separated requirement or ticket IDs, e.g. `JP-12,JP-13`.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description: "JSON object of custom case fields keyed by system name, e.g. `{\"custom_preconds\": \"Gate closed\", \"custom_steps_separated\": [{\"content\": \"Cut power\", \"expected\": \"Gate stays locked\"}]}`. Use **Get Metadata** (resource `case_fields`) for valid names, types and required fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      title: this.title,
      ...utils.parseJsonObject(this.customFields, "customFields"),
    };
    if (this.templateId) data.template_id = this.templateId;
    if (this.typeId) data.type_id = this.typeId;
    if (this.priorityId) data.priority_id = this.priorityId;
    if (this.estimate) data.estimate = this.estimate;
    if (this.refs) data.refs = this.refs;
    const response = await this.app._makeRequest({
      $,
      path: `add_case/${this.sectionId}`,
      method: "POST",
      data,
    });
    $.export("$summary", `Created case ${response.id}: ${response.title}`);
    return response;
  },
};
