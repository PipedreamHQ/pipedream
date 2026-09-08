import salesforce from "../../salesforce_rest_api.app.mjs";
import constants from "../../common/constants.mjs";
import {
  assertSalesforceId, escapeSoqlString, toSoqlDateTimeLiteral,
} from "../../common/soql.mjs";

export default {
  key: "salesforce_rest_api-list-cases",
  name: "List Cases",
  description: "List Salesforce support cases, newest first."
    + " Use this to find a case and its ID."
    + " Every filter is optional and they combine with AND - call with no filters to see the most recent cases."
    + " For example, `Status` `New` with `Limit` `10` returns the ten newest open cases."
    + " Status values are org-configurable."
    + " [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_case.htm)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    salesforce,
    caseNumber: {
      type: "string",
      label: "Case Number",
      description: "Return only the case with this case number, e.g. `00001024`. This is the human-readable number shown in the Salesforce UI, not the record ID.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject Contains",
      description: "Return only cases whose subject contains this text (case-insensitive), e.g. `rotor`.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: `Return only cases with this exact status, e.g. \`${constants.CASE_DEFAULT_STATUSES[0]}\`. Org-configurable - use **Describe Object** on \`Case\` to list the valid values.`,
      optional: true,
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Return only cases on this account (15- or 18-character Salesforce ID, e.g. `001P500000dGpZLIA0`). Use **Find Records** on `Account` to look one up.",
      optional: true,
    },
    isClosed: {
      type: "boolean",
      label: "Is Closed",
      description: "Set to `true` to return only closed cases, or `false` for only open ones. Omit to return both.",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Return only cases created on or after this moment. ISO 8601 date (`2026-08-01`) or date-time (`2026-08-01T00:00:00Z`).",
      optional: true,
    },
    fields: {
      propDefinition: [
        salesforce,
        "fieldsToObtain",
        () => ({
          objType: constants.OBJECT_TYPE.CASE,
        }),
      ],
      label: "Fields",
      description: `The Case fields to return. Defaults to a compact set: ${constants.CASE_LIST_FIELDS.join(", ")}. \`Id\` is always returned.`,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `The maximum number of cases to return. Valid values are integers from 1 through ${constants.MAX_LIMIT}. Default is ${constants.DEFAULT_LIMIT}.`,
      default: constants.DEFAULT_LIMIT,
      min: 1,
      max: constants.MAX_LIMIT,
      optional: true,
    },
  },
  async run({ $ }) {
    // Id is always selected: a caller narrowing Fields to save context would
    // otherwise lose the ID that every follow-up case action needs.
    const fields = [
      ...new Set([
        "Id",
        ...this.fields?.length
          ? this.fields
          : constants.CASE_LIST_FIELDS,
      ]),
    ];

    const conditions = [];
    if (this.caseNumber) {
      conditions.push(`CaseNumber = '${escapeSoqlString(this.caseNumber)}'`);
    }
    if (this.subject) {
      conditions.push(`Subject LIKE '%${escapeSoqlString(this.subject)}%'`);
    }
    if (this.status) {
      conditions.push(`Status = '${escapeSoqlString(this.status)}'`);
    }
    if (this.accountId) {
      conditions.push(`AccountId = '${assertSalesforceId(this.accountId, "Account ID")}'`);
    }
    if (typeof this.isClosed === "boolean") {
      conditions.push(`IsClosed = ${this.isClosed}`);
    }
    if (this.createdAfter) {
      conditions.push(`CreatedDate >= ${toSoqlDateTimeLiteral(this.createdAfter, "Created After")}`);
    }

    let query = `SELECT ${fields.join(", ")} FROM ${constants.OBJECT_TYPE.CASE}`;
    if (conditions.length) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += ` ORDER BY CreatedDate DESC, Id DESC LIMIT ${this.limit || constants.DEFAULT_LIMIT}`;

    const { records } = await this.salesforce.query({
      $,
      query,
    });
    $.export("$summary", `Successfully retrieved ${records.length} case${records.length === 1
      ? ""
      : "s"}`);
    return records;
  },
};
