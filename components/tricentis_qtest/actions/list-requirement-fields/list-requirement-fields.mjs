import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-list-requirement-fields",
  name: "List Requirement Fields",
  description: "List all available fields for requirements in a qTest project, including field IDs, types, and allowed values. Use this to discover field IDs before creating or updating requirements. Pass `fields` (e.g. `[\"id\", \"label\", \"required\"]`) to keep only those attributes per field — some fields' `allowed_values` lists are long, so omitting them when you only need the field ID/label keeps the response small. Example: `projectId: 1` → returns `[{id: 3, label: \"Priority\", attribute_type: \"String\", allowed_values: [{label: \"High\", value: \"1\"}, {label: \"Medium\", value: \"2\"}], required: false}]`. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/requirement_apis.htm)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tricentisQtest,
    projectId: {
      propDefinition: [
        tricentisQtest,
        "projectId",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of attribute names to include per field object (e.g. `[\"id\", \"label\", \"required\"]`) — omit to return every attribute, including `allowed_values` (today's default).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tricentisQtest.getRequirementFields({
      projectId: this.projectId,
      $,
    });
    const result = this.fields?.length
      ? response?.map((field) => Object.fromEntries(this.fields.map((name) => [
        name,
        field[name],
      ])))
      : response;
    $.export("$summary", `Successfully fetched ${result?.length ?? 0} requirement field${
      (result?.length ?? 0) === 1
        ? ""
        : "s"
    }`);
    return result;
  },
};
