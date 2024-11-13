import commonActions from "../../common/actions.mjs";
import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "airtable_oauth-create-single-record",
  name: "Create Single Record",
  description: "Adds a record to a table. [See the documentation](https://airtable.com/developers/web/api/create-records)",
  version: "0.0.7",
  type: "action",
  props: {
    ...common.props,
    tableId: {
      ...common.props.tableId,
      reloadProps: true,
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
  async additionalProps() {
    return commonActions.additionalProps(this);
  },
  async run({ $ }) {
    return commonActions.createRecord(this, $);
  },
};
