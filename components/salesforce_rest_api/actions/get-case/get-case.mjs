import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-get-case",
  name: "Get Case",
  description: "Retrieves a case by its ID. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    salesforce,
    caseId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "Case",
        }),
      ],
      label: "Case ID",
      description: "The case ID to retrieve",
    },
  },
  async run({ $ }) {
    const fields = (await this.salesforce.getFieldsForObjectType("Case")).map(({ name }) => name);

    let query = `SELECT ${fields.join(", ")} FROM Case WHERE Id = '${this.caseId}'`;

    const { records } = await this.salesforce.query({
      $,
      query,
    });

    $.export("$summary", `Successfully retrieved case with ID ${this.caseId}`);
    return records[0];
  },
};
