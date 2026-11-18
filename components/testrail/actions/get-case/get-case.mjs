import app from "../../testrail.app.mjs";

const DEFAULT_FIELDS = [
  "title",
  "section_id",
  "suite_id",
  "template_id",
  "type_id",
  "priority_id",
  "refs",
  "estimate",
  "custom_preconds",
  "custom_steps",
  "custom_expected",
  "custom_steps_separated",
  "updated_on",
];

export default {
  key: "testrail-get-case",
  name: "Get Case",
  description: "Get one test case by its case ID, including its preconditions, steps and expected results. Use it when you have a case ID and need the details, or before changing a case. To find cases by title or section, use **List Cases**; to edit it, use **Update Case**. Case objects are large, so pass `fields` for just what you need; id is always returned. Returns title, section_id, suite_id, priority_id, type_id, refs, estimate and the common step fields by default. Example: caseId=1064, fields=[\"title\", \"custom_steps_separated\"] → {id: 1064, title: \"Raptor paddock gate lock engages\", custom_steps_separated: [...]}. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      description: "The numeric case ID, e.g. `1064`. This is NOT a test ID. Use **List Cases** to find it.",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Case fields to return, e.g. `[\"title\", \"custom_steps_separated\"]`. `id` is always included. Defaults to: title, section_id, suite_id, template_id, type_id, priority_id, refs, estimate, custom_preconds, custom_steps, custom_expected, custom_steps_separated, updated_on. Use **Get Configuration** to list every custom_* field.",
      optional: true,
    },
  },
  async run({ $ }) {
    const found = await this.app._makeRequest({
      $,
      endpoint: `get_case/${this.caseId}`,
    });
    $.export("$summary", `Case ${found.id}: ${found.title}`);
    return this.app.shape(found, this.fields, DEFAULT_FIELDS);
  },
};
