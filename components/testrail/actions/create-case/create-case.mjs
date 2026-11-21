import app from "../../testrail.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "testrail-create-case",
  name: "Create Case",
  description: "Creates a test case in a TestRail section. Use it when the user wants a new test written down, for example while documenting tests for a new feature. Not for recording a pass or fail (use **Add Result**); check **List Cases** first so you do not create a duplicate, and find the section with **List Sections**. Steps, preconditions and expected results are custom fields that vary per instance: call **Get Custom Fields** with fieldType `case` and pass them in `customFields`, since instances can make some of them mandatory. Returns the new case's id, title, section_id, suite_id, priority_id and a url. Example: sectionId=136, title=\"Goat delivery precedes raptor feeding\", priorityId=3, customFields={\"custom_steps_separated\": [{\"content\": \"Log delivery\", \"expected\": \"Delivery logged\"}]} → the new case. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      description: "The section to create the case in; the suite follows from it. Use **List Sections** to find it, or **Create Section** to make one. Example: `136`.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The case's title. Example: `Door locks within 5s of closing`.",
    },
    priorityId: {
      type: "integer",
      label: "Priority ID",
      description: "Priority of the case: 1 Low, 2 Medium, 3 High, 4 Critical on default instances. Leave empty for the instance default. Example: `3`.",
      optional: true,
    },
    typeId: {
      type: "integer",
      label: "Case Type ID",
      description: "Case type ID, for example 6 Functional or 9 Regression on default instances. Leave empty for the instance default. Example: `6`.",
      optional: true,
    },
    estimate: {
      type: "string",
      label: "Estimate",
      description: "Estimated time to run the case, as a timespan. Example: `30s` or `1m 45s`.",
      optional: true,
    },
    refs: {
      type: "string",
      label: "References",
      description: "Comma-separated requirement or issue IDs this case covers. Example: `JP-101,JP-102`.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom case fields as an object keyed by system name, for steps, preconditions and expected results. Use **Get Custom Fields** with fieldType `case` for the names and any mandatory ones. Example: `{\"custom_preconds\": \"Paddock empty\", \"custom_steps_separated\": [{\"content\": \"Close the door\", \"expected\": \"Door locks\"}]}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.addCase({
      $,
      sectionId: this.sectionId,
      data: {
        title: this.title,
        priority_id: this.priorityId,
        type_id: this.typeId,
        estimate: this.estimate,
        refs: this.refs,
        ...parseObject(this.customFields),
      },
    });
    $.export("$summary", `Created case ${response.id}: ${response.title}`);
    return {
      id: response.id,
      title: response.title,
      section_id: response.section_id,
      suite_id: response.suite_id,
      priority_id: response.priority_id,
      url: this.app.caseUrl(response.id),
    };
  },
};
