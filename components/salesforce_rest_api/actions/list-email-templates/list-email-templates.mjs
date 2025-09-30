import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-list-email-templates",
  name: "List Email Templates",
  description: "Lists all email templates. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_emailtemplate.htm)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    salesforce,
  },
  async run({ $ }) {
    const fields = (await this.salesforce.getFieldsForObjectType("EmailTemplate")).map(({ name }) => name);
    const query = `SELECT ${fields.join(", ")} FROM EmailTemplate`;

    const { records } = await this.salesforce.query({
      $,
      query,
    });
    $.export("$summary", `Sucessfully retrieved ${records.length} email templates`);
    return records;
  },
};
