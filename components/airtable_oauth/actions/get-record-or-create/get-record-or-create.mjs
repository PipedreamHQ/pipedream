import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";
import commonActions from "../../common/actions.mjs";

export default {
  key: "airtable_oauth-get-record-or-create",
  name: "Get Record Or Create",
  description: "Get a specific record, or create one if it doesn't exist. [See the documentation](https://airtable.com/developers/web/api/create-records)",
  version: "0.1.1",
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
        if (err.response?.status === 404) {
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
