// x-pd-ai: optimized
import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";
import commonActions from "../../common/actions.mjs";

export default {
  key: "airtable_oauth-update-record",
  name: "Update Record",
  description: "Update a record's fields by Record ID — a partial update; only the fields included in `record` are changed, all others are left as-is. Use **List Tables** to look up field names first, and **List Records** to find the record's ID. [See the documentation](https://airtable.com/developers/web/api/update-record)",
  version: "0.1.0",
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
    },
    returnFieldsByFieldId: {
      propDefinition: [
        airtable,
        "returnFieldsByFieldId",
      ],
    },
  },
  async run({ $ }) {
    return commonActions.updateRecord(this, $);
  },
};
