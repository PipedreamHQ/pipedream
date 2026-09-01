// x-pd-ai: optimized
import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";
import commonActions from "../../common/actions.mjs";

export default {
  key: "airtable_oauth-get-record-or-create",
  name: "Get Record Or Create",
  description: "Fetch a record by its Record ID. If the ID is blank, or doesn't match an existing record, create a new record instead using `record`. Use **List Tables** to look up field names first, and **List Records** to find an existing record's ID. [See the get-record documentation](https://airtable.com/developers/web/api/get-record) and the [create-record documentation](https://airtable.com/developers/web/api/create-records)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    recordId: {
      propDefinition: [
        airtable,
        "recordId",
        ({
          baseId, tableId,
        }) => ({
          baseId: baseId?.value ?? baseId,
          tableId: tableId?.value ?? tableId,
        }),
      ],
      optional: true,
    },
    record: {
      propDefinition: [
        airtable,
        "record",
      ],
      optional: true,
    },
    customExpressionInfo: {
      propDefinition: [
        airtable,
        "customExpressionInfo",
      ],
    },
    typecast: {
      propDefinition: [
        airtable,
        "typecast",
      ],
      optional: true,
    },
    returnFieldsByFieldId: {
      propDefinition: [
        airtable,
        "returnFieldsByFieldId",
      ],
    },
  },
  async run({ $ }) {
    const recordId = this.recordId ?? undefined;

    if (recordId) {
      try {
        return await commonActions.getRecord(this, $);
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 403) {
          return await commonActions.createRecord(this, $);
        } else {
          this.airtable.throwFormattedError(err);
        }
      }
    } else {
      return commonActions.createRecord(this, $);
    }
  },
};
