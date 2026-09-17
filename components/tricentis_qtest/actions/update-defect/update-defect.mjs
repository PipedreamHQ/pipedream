import { ConfigurationError } from "@pipedream/platform";
import { isValidProperty } from "../../common/utils.mjs";
import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-update-defect",
  name: "Update Defect",
  description: "Update an existing defect in a qTest project. Use **List Defects** to find the defect ID and **List Defect Fields** to discover field IDs for the Properties parameter. Example: `projectId: 1, defectId: \"201\", properties: \"[{\\\"field_id\\\": 2, \\\"field_value\\\": \\\"2\\\"}]\"` → returns the updated defect object. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/defect_apis.htm#UpdateADefect)",
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
    defectId: {
      propDefinition: [
        tricentisQtest,
        "defectId",
      ],
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
    const response = await this.tricentisQtest.updateDefect({
      $,
      projectId: this.projectId,
      defectId: this.defectId,
      data: {
        properties,
      },
    });
    $.export("$summary", `Successfully updated defect (ID: ${this.defectId})`);
    return response;
  },
};
