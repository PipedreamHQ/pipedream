// x-pd-ai: optimized
import salesforce from "../../salesforce_rest_api.app.mjs";
import constants from "../../common/constants.mjs";
import {
  assertSalesforceId, buildFieldList, truncationNote,
} from "../../common/soql.mjs";

export default {
  key: "salesforce_rest_api-list-email-messages",
  name: "List Email Messages",
  description: "List Salesforce email messages, newest first, optionally scoped to one case."
    + " Returns the full email records including subject and body - use **List Case Feed Items** instead if you only need to know that an email happened."
    + " Find the case ID with **List Cases** first."
    + " Omit `Case ID` to list the most recent emails across the org, which can be large - set `Limit`."
    + " [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_emailmessage.htm)",
  version: "0.1.0",
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
          objType: constants.OBJECT_TYPE.CASE,
        }),
      ],
      label: "Case ID",
      description: "The ID of the case to retrieve email messages for (15- or 18-character Salesforce ID, e.g. `5005g00001ABCDeAAI`). Use the **List Cases** action to retrieve case IDs. Omit to list emails across all records.",
      optional: true,
    },
    fields: {
      propDefinition: [
        salesforce,
        "fieldsToObtain",
        () => ({
          objType: constants.OBJECT_TYPE.EMAIL_MESSAGE,
        }),
      ],
      label: "Fields",
      description: "The EmailMessage fields to return. Defaults to every field on the object, which includes the full message body. `Id` is always returned.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `The maximum number of email messages to return. Valid values are integers from 1 through ${constants.MAX_LIMIT}. Omit to return every message Salesforce sends in one batch.`,
      min: 1,
      max: constants.MAX_LIMIT,
      optional: true,
    },
  },
  async run({ $ }) {
    const caseId = this.caseId
      ? assertSalesforceId(this.caseId, "Case ID")
      : null;

    const allFields = (await this.salesforce
      .getFieldsForObjectType(constants.OBJECT_TYPE.EMAIL_MESSAGE))
      .map(({ name }) => name);
    const fields = buildFieldList(this.fields, allFields);

    let query = `SELECT ${fields.join(", ")} FROM ${constants.OBJECT_TYPE.EMAIL_MESSAGE}`;
    if (caseId) {
      query += ` WHERE RelatedToId = '${caseId}'`;
    }
    query += " ORDER BY CreatedDate DESC, Id DESC";
    if (this.limit) {
      query += ` LIMIT ${this.limit}`;
    }

    const response = await this.salesforce.query({
      $,
      query,
    });
    const { records } = response;
    const scope = caseId
      ? ` for case with ID ${caseId}`
      : "";
    $.export("$summary", `Successfully retrieved ${records.length} email message${records.length === 1
      ? ""
      : "s"}${scope}.${truncationNote(response, records.length)}`);
    return records;
  },
};
