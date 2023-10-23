import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";
import commonActions from "../../common/actions.mjs";

export default {
  key: "airtable_oauth-get-record",
  name: "Get Record",
  description: "Get a record from a table by record ID.",
  version: "0.0.2",
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
          baseId: baseId.value,
          tableId: tableId.value,
        }),
      ],
    },
  },
  async run({ $ }) {
    return commonActions.getRecord(this, $);
  },
};
