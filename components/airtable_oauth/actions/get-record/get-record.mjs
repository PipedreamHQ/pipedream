import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";
import commonActions from "../../common/actions.mjs";

export default {
  key: "airtable_oauth-get-record",
  name: "Get Record",
  description: "Get data of a selected record from a table. [See the documentation](https://airtable.com/developers/web/api/get-record)",
  version: "0.0.11",
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
