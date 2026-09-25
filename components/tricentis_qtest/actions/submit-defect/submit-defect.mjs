import { ConfigurationError } from "@pipedream/platform";
import { isValidProperty } from "../../common/utils.mjs";
import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-submit-defect",
  name: "Submit Defect",
  description: "Submit a new defect in a qTest project. Use **List Project ID Options** for the project ID and **List Defect Fields** to discover field IDs and required fields for the Properties parameter. Example: `projectId: 1, properties: \"[{\\\"field_id\\\": 1, \\\"field_value\\\": \\\"Button not clickable\\\"}, {\\\"field_id\\\": 2, \\\"field_value\\\": \\\"1\\\"}]\"` → returns `{id: 202, properties: [...]}`. [See the documentation](https://docs.tricentis.com/qtest-saas/content/apis/apis/defect_apis.htm#submit-a-defect)",
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
    properties: {
      propDefinition: [
        tricentisQtest,
        "properties",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    if (this.properties === undefined) {
      throw new ConfigurationError("`Properties` is required to submit a defect (e.g. Summary/Description are typically required fields) — use List Defect Fields to find required field IDs");
    }
    let properties;
    try {
      properties = JSON.parse(this.properties);
    } catch (error) {
      throw new ConfigurationError(`\`Properties\` is not valid JSON: ${error.message}`);
    }
    if (!Array.isArray(properties) || !properties.every(isValidProperty)) {
      throw new ConfigurationError("`Properties` must be a JSON array of {field_id, field_value} objects");
    }
    const response = await this.tricentisQtest.createDefect({
      $,
      projectId: this.projectId,
      data: {
        properties,
      },
    });
    $.export("$summary", `Successfully submitted defect (ID: ${response.id})`);
    return response;
  },
};
