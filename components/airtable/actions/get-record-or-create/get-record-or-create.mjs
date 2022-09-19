import airtable from "../../airtable.app.mjs";
import common from "../common.mjs";
import commonActions from "../../common/actions.mjs";

export default {
  key: "airtable-get-record-or-create",
  name: "Get Record or Create",
  description: "Get a record from a table by record ID or create a new register.",
  version: "0.0.2",
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
    typecast: {
      propDefinition: [
        airtable,
        "typecast",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    return commonActions.additionalProps(this);
  },
  async run({ $ }) {
    const recordId = this.recordId ?? undefined;

    if (recordId) {
      try {
        return await commonActions.getRecord(this, $, true);
      } catch (err) {
        if (err.statusCode === 404) {
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
