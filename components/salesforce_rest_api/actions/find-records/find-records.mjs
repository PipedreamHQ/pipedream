// x-pd-ai: optimized
import salesforce from "../../salesforce_rest_api.app.mjs";
import constants from "../../common/constants.mjs";
import {
  assertSalesforceId, truncationNote,
} from "../../common/soql.mjs";

export default {
  key: "salesforce_rest_api-find-records",
  name: "Find Records",
  description: "Retrieve selected fields for records of any Salesforce object, either specific records by ID or the most recent ones."
    + " Use this as the general-purpose record reader when no object-specific action fits - prefer **List Cases** for cases or **Get Record by ID** for a single known record."
    + " Use **List Objects** to discover object types and **List Object Fields** to discover field names."
    + " For example, `SObject Type` `Account` with `Fields to Obtain` `Id, Name` and `Limit` `25` returns the 25 most recently created accounts."
    + " Leaving `Record ID(s)` empty returns recent records, not every record - Salesforce sends one batch, so set `Limit` and use **SOQL Query** when you need everything."
    + " Newest-first ordering needs `CreatedDate`, so results are unordered on the few object types that lack it."
    + " [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_query.htm)",
  version: "0.3.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    salesforce,
    sobjectType: {
      propDefinition: [
        salesforce,
        "objectType",
      ],
      description: "The type of object to obtain records of, e.g. `Account`. Use **List Objects** to discover the object types in this org.",
    },
    fieldsToObtain: {
      propDefinition: [
        salesforce,
        "fieldsToObtain",
        (c) => ({
          objType: c.sobjectType,
        }),
      ],
      description: "The fields to return, e.g. `Id`, `Name`. Use **List Object Fields** to discover field names for the selected object. Include `Id` if you plan to act on the records afterwards.",
    },
    recordIds: {
      propDefinition: [
        salesforce,
        "recordId",
        (c) => ({
          objType: c.sobjectType,
        }),
      ],
      label: "Record ID(s)",
      type: "string[]",
      optional: true,
      description: "The specific record(s) to retrieve (15- or 18-character Salesforce IDs). Leave empty to retrieve the most recent records of this object type.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `The maximum number of records to return. Valid values are integers from 1 through ${constants.MAX_LIMIT}. Omit to return every record Salesforce sends in one batch.`,
      min: 1,
      max: constants.MAX_LIMIT,
      optional: true,
    },
  },
  async run({ $ }) {
    let {
      sobjectType,
      recordIds,
      fieldsToObtain,
    } = this;

    if (typeof recordIds === "string") {
      recordIds = recordIds.split(",");
    }
    if (typeof fieldsToObtain === "string") {
      fieldsToObtain = fieldsToObtain.split(",");
    }

    let query = `SELECT ${fieldsToObtain.join(", ")} FROM ${sobjectType}`;

    if (recordIds?.length) {
      const ids = recordIds.map((id) => assertSalesforceId(id.trim(), "Record ID(s)"));
      query += ` WHERE Id IN ('${ids.join("','")}')`;
    } else {
      // This action accepts any object type, and not every one has CreatedDate
      // (PicklistValueInfo, for example). SOQL rejects the whole query rather than
      // ignoring the clause, so only sort by it when the object actually has it.
      const fields = await this.salesforce.getFieldsForObjectType(sobjectType);
      const { CREATED_DATE: createdDate } = constants.FIELD_NAME;
      if (fields.some(({ name }) => name === createdDate)) {
        query += ` ORDER BY ${createdDate} DESC, Id DESC`;
      }
    }
    if (this.limit) {
      query += ` LIMIT ${this.limit}`;
    }

    const response = await this.salesforce.query({
      $,
      query,
    });
    const { records } = response;
    $.export("$summary", `Successfully retrieved ${records.length} ${sobjectType} record${records.length === 1
      ? ""
      : "s"}.${truncationNote(response, records.length)}`);
    return records;
  },
};
