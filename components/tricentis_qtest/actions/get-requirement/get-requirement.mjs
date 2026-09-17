import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-get-requirement",
  name: "Get Requirement",
  description: "Get full details of a specific requirement by ID. Use **List Requirements** to find the requirement ID. Example: `projectId: 1, requirementId: \"101\"` → returns `{id: 101, name: \"User can log in\", properties: [{field_id: 3, field_value: \"High\"}]}`. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/requirement_apis.htm#GetARequirementByItsID)",
  version: "0.0.3",
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
    requirementId: {
      propDefinition: [
        tricentisQtest,
        "requirementId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tricentisQtest.getRequirement({
      $,
      projectId: this.projectId,
      requirementId: this.requirementId,
    });
    $.export("$summary", `Successfully fetched requirement (ID: ${this.requirementId})`);
    return response;
  },
};
