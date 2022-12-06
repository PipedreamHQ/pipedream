import airtable from "../../airtable.app.mjs";
import common from "../common.mjs";
import commonActions from "../../common/actions.mjs";

export default {
  key: "airtable-update-record",
  name: "Update record",
  description: "Update a single record in a table by Record ID.",
  version: "1.0.2",
  type: "action",
  props: {
    ...common.props,
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    tableId: {
      ...common.props.tableId,
      reloadProps: true,
    },
    recordId: {
      propDefinition: [
        airtable,
        "recordId",
      ],
    },
  },
  async additionalProps() {
    return commonActions.additionalProps(this);
  },
  async run({ $ }) {
    return commonActions.updateRecord(this, $);
  },
};
