// x-pd-ai: optimized
import commonActions from "../../common/actions.mjs";
import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "airtable_oauth-create-single-record",
  name: "Create Single Record",
  description: "Create a new record in a table. Provide field values in `record`, e.g. `{ \"Name\": \"Acme\", \"Stage\": \"Won\" }`. Use **List Tables** first to look up the table's field names and types. [See the documentation](https://airtable.com/developers/web/api/create-records)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
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
    return commonActions.createRecord(this, $);
  },
};
