import { ConfigurationError } from "@pipedream/platform";
import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-create-requirement",
  name: "Create Requirement",
  description: "Create a new requirement under a parent module in a qTest project. Use **List Project ID Options** for the project ID, **List Modules** for the parent module ID, and **List Requirement Fields** to discover field IDs for the Properties parameter. Example: `projectId: 1, parentId: \"10\", requirementName: \"User can reset password\", properties: [{\"field_id\": 3, \"field_value\": \"1\"}]` → returns `{id: 103, name: \"User can reset password\", ...}`. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/requirement_apis.htm#CreateARequirement)",
  version: "1.0.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
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
    parentId: {
      propDefinition: [
        tricentisQtest,
        "parentId",
      ],
    },
    requirementName: {
      type: "string",
      label: "Requirement Name",
      description: "The name of the new requirement",
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "A JSON array of field properties to set on the requirement. Use the **List Requirement Fields** action to discover available field IDs. Example: `[{\"field_id\": 3, \"field_value\": \"1\"}]`",
      optional: true,
    },
  },
  async run({ $ }) {
    let properties;
    try {
      properties = this.properties && JSON.parse(this.properties);
    } catch (error) {
      throw new ConfigurationError(`\`Properties\` is not valid JSON: ${error.message}`);
    }
    const response = await this.tricentisQtest.createRequirement({
      $,
      projectId: this.projectId,
      params: {
        parentId: this.parentId,
      },
      data: {
        name: this.requirementName,
        properties,
      },
    });
    $.export("$summary", `Successfully created requirement (ID: ${response.id})`);
    return response;
  },
};
