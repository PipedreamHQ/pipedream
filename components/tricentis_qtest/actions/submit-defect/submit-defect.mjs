import { ConfigurationError } from "@pipedream/platform";
import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-submit-defect",
  name: "Submit Defect",
  description: "Submit a new defect in a qTest project. Use **List Project ID Options** for the project ID and **List Defect Fields** to discover field IDs and required fields for the Properties parameter. Example: `projectId: 1, properties: [{\"field_id\": 1, \"field_value\": \"Button not clickable\"}, {\"field_id\": 2, \"field_value\": \"1\"}]` → returns `{id: 202, properties: [...]}`. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/defect_apis.htm#SubmitaDefect)",
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
      type: "string",
      label: "Properties",
      description: "A JSON array of field properties to set on the defect. Use the **List Defect Fields** action to discover available field IDs and which are required. Example: `[{\"field_id\": 1, \"field_value\": \"Button not clickable\"}, {\"field_id\": 2, \"field_value\": \"1\"}]`",
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
