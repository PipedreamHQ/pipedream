import salesforce from "../../salesforce_rest_api.app.mjs";
import constants from "../../common/constants.mjs";
import {
  buildFieldList, truncationNote,
} from "../../common/soql.mjs";

export default {
  key: "salesforce_rest_api-list-email-templates",
  name: "List Email Templates",
  description: "List Salesforce email templates, newest first."
    + " Use this to find a template and its ID before sending with **Send Email**, or before editing with **Update Email Template**."
    + " For example, run with `Limit` `50`, then pass the `Id` of the template you want to **Send Email**."
    + " [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_emailtemplate.htm)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    salesforce,
    fields: {
      propDefinition: [
        salesforce,
        "fieldsToObtain",
        () => ({
          objType: constants.OBJECT_TYPE.EMAIL_TEMPLATE,
        }),
      ],
      label: "Fields",
      description: "The EmailTemplate fields to return. Defaults to every field on the object, which includes the full template body. `Id` is always returned.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `The maximum number of templates to return. Valid values are integers from 1 through ${constants.MAX_LIMIT}. Omit to return every template Salesforce sends in one batch.`,
      min: 1,
      max: constants.MAX_LIMIT,
      optional: true,
    },
  },
  async run({ $ }) {
    const allFields = (await this.salesforce
      .getFieldsForObjectType(constants.OBJECT_TYPE.EMAIL_TEMPLATE))
      .map(({ name }) => name);
    const fields = buildFieldList(this.fields, allFields);

    let query = `SELECT ${fields.join(", ")} FROM ${constants.OBJECT_TYPE.EMAIL_TEMPLATE}`
      + " ORDER BY CreatedDate DESC, Id DESC";
    if (this.limit) {
      query += ` LIMIT ${this.limit}`;
    }

    const response = await this.salesforce.query({
      $,
      query,
    });
    const { records } = response;
    $.export("$summary", `Successfully retrieved ${records.length} email template${records.length === 1
      ? ""
      : "s"}.${truncationNote(response, records.length)}`);
    return records;
  },
};
