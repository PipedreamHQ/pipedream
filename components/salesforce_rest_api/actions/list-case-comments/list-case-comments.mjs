import salesforce from "../../salesforce_rest_api.app.mjs";
import constants from "../../common/constants.mjs";
import {
  assertSalesforceId, buildFieldList, truncationNote,
} from "../../common/soql.mjs";

export default {
  key: "salesforce_rest_api-list-case-comments",
  name: "List Case Comments",
  description: "List the comments on a Salesforce case, newest first."
    + " Use this for the case's comment thread only - use **List Case Feed Items** for the full activity trail (status changes, logged calls, emails) or **List Email Messages** for emails on the case."
    + " Find the case ID with **List Cases** first."
    + " For example, case ID `5005g00001ABCDeAAI` with `Limit` `20` returns that case's twenty most recent comments."
    + " [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_casecomment.htm)",
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
    caseId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: constants.OBJECT_TYPE.CASE,
        }),
      ],
      label: "Case ID",
      description: "The ID of the case to retrieve comments for (15- or 18-character Salesforce ID, e.g. `5005g00001ABCDeAAI`). Use the **List Cases** action to retrieve case IDs.",
    },
    fields: {
      propDefinition: [
        salesforce,
        "fieldsToObtain",
        () => ({
          objType: constants.OBJECT_TYPE.CASE_COMMENT,
        }),
      ],
      label: "Fields",
      description: "The CaseComment fields to return. Defaults to every field on the object. `Id` is always returned.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `The maximum number of comments to return. Valid values are integers from 1 through ${constants.MAX_LIMIT}. Omit to return every comment Salesforce sends in one batch.`,
      min: 1,
      max: constants.MAX_LIMIT,
      optional: true,
    },
  },
  async run({ $ }) {
    const caseId = assertSalesforceId(this.caseId, "Case ID");

    const allFields = (await this.salesforce
      .getFieldsForObjectType(constants.OBJECT_TYPE.CASE_COMMENT))
      .map(({ name }) => name);
    const fields = buildFieldList(this.fields, allFields);

    let query = `SELECT ${fields.join(", ")} FROM ${constants.OBJECT_TYPE.CASE_COMMENT}`
      + ` WHERE ParentId = '${caseId}' ORDER BY CreatedDate DESC, Id DESC`;
    if (this.limit) {
      query += ` LIMIT ${this.limit}`;
    }

    const response = await this.salesforce.query({
      $,
      query,
    });
    const { records } = response;
    $.export("$summary", `Successfully retrieved ${records.length} comment${records.length === 1
      ? ""
      : "s"} for case with ID ${caseId}.${truncationNote(response, records.length)}`);
    return records;
  },
};
