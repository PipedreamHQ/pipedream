import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-get-defect",
  name: "Get Defect",
  description: "Get full details of a specific defect by ID. Use **List Defects** to find the defect ID and **List Defect Fields** to interpret field IDs in the response. Example: `projectId: 1, defectId: \"201\"` → returns `{id: 201, properties: [{field_id: 1, field_value: \"Login crash\"}, {field_id: 2, field_value: \"New\"}]}`. [See the documentation](https://docs.tricentis.com/qtest-saas/content/apis/apis/defect_apis.htm#get-a-defect-by-its-id)",
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
    defectId: {
      propDefinition: [
        tricentisQtest,
        "defectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tricentisQtest.getDefect({
      $,
      projectId: this.projectId,
      defectId: this.defectId,
    });
    $.export("$summary", `Successfully fetched defect (ID: ${this.defectId})`);
    return response;
  },
};
