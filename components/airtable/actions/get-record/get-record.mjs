import airtable from "../../airtable.app.mjs";
import common from "../common.mjs";
import commonActions from "../../common/actions.mjs";

export default {
  key: "airtable-get-record",
  name: "Get Record",
  description: "Get a record from a table by record ID.",
  version: "0.2.2",
  type: "action",
  props: {
    ...common.props,
    recordId: {
      propDefinition: [
        airtable,
        "recordId",
      ],
    },
  },
  async run({ $ }) {
    return commonActions.getRecord(this, $);
  },
};
