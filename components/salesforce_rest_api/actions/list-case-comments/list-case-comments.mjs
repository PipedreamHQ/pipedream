import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-list-case-comments",
  name: "List Case Comments",
  description: "Lists all comments for a case. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
  version: "0.0.3",
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
    },
  },
  async run({ $ }) {
    const fields = (await this.salesforce.getFieldsForObjectType("CaseComment")).map(({ name }) => name);
    let query = `SELECT ${fields.join(", ")} FROM CaseComment WHERE ParentId = '${this.caseId}'`;

    const { records } = await this.salesforce.query({
      $,
      query,
    });
    $.export("$summary", `Sucessfully retrieved ${records.length} comments for case with ID ${this.caseId}`);
    return records;
  },
};
