import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-list-email-messages",
  name: "List Email Messages",
  description: "Lists all email messages for a case. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
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
      description: "The ID of the case to retrieve email messages for",
      optional: true,
    },
  },
  async run({ $ }) {
    const fields = (await this.salesforce.getFieldsForObjectType("EmailMessage")).map(({ name }) => name);
    let query = `SELECT ${fields.join(", ")} FROM EmailMessage`;
    if (this.caseId) {
      query += ` WHERE RelatedToId = '${this.caseId}'`;
    }

    const { records } = await this.salesforce.query({
      $,
      query,
    });
    $.export("$summary", `Sucessfully retrieved ${records.length} email messages for case with ID ${this.caseId}`);
    return records;
  },
};
