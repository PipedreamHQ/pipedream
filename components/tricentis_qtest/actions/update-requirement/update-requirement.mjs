import { ConfigurationError } from "@pipedream/platform";
import { isValidProperty } from "../../common/utils.mjs";
import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-update-requirement",
  name: "Update Requirement",
  description: "Update ONE existing requirement in a qTest project. Use **List Requirements** to find the requirement ID and **List Requirement Fields** to discover field IDs for the Properties parameter. This tool has no bulk/mass-update mode — before calling it repeatedly to apply the same change across many requirements, confirm the full scope (which requirements, what change) with the user first; do not sweep an entire project's requirements on a single broad instruction. If you ask for that confirmation and don't receive an explicit yes, STOP — do not call this tool anyway. Proceeding without an actual confirmation is exactly the behavior this warning exists to prevent, even if the original instruction sounded broad enough to imply it. Example: `projectId: 1, requirementId: \"101\", properties: \"[{\\\"field_id\\\": 3, \\\"field_value\\\": \\\"1\\\"}]\"` → returns the updated requirement object. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/requirement_apis.htm#UpdateARequirement)",
  version: "1.0.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    name: {
      type: "string",
      label: "Name",
      description: "Updated name for the requirement",
      optional: true,
    },
    properties: {
      propDefinition: [
        tricentisQtest,
        "properties",
      ],
    },
  },
  async run({ $ }) {
    let properties;
    try {
      properties = this.properties === undefined
        ? undefined
        : JSON.parse(this.properties);
    } catch (error) {
      throw new ConfigurationError(`\`Properties\` is not valid JSON: ${error.message}`);
    }
    if (properties !== undefined
      && (!Array.isArray(properties) || !properties.every(isValidProperty))) {
      throw new ConfigurationError("`Properties` must be a JSON array of {field_id, field_value} objects");
    }
    const response = await this.tricentisQtest.updateRequirement({
      $,
      projectId: this.projectId,
      requirementId: this.requirementId,
      data: {
        name: this.name,
        properties,
      },
    });
    $.export("$summary", `Successfully updated requirement (ID: ${this.requirementId})`);
    return response;
  },
};
