import commonActions from "../../common/actions.mjs";
import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "airtable_oauth-create-single-record",
  name: "Create Single Record",
  description: "Adds a record to a table.",
  version: "0.1.0",
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
