import airtable from "../../airtable.app.mjs";
import common from "../common.mjs";
import commonActions from "../../common/actions.mjs";

export default {
  key: "airtable-create-single-record-or-update",
  name: "Create single record or update",
  description: "Updates a record if `recordId` is provided or adds a record to a table.",
  version: "0.0.3",
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
      optional: true,
      description: "Enter a [record ID](https://support.airtable.com/hc/en-us/articles/360051564873-Record-ID) if you want to update an existing record. Leave blank to create a new record.",
    },
    typecast: {
      propDefinition: [
        airtable,
        "typecast",
      ],
    },
  },
  async additionalProps() {
    return commonActions.additionalProps(this);
  },
  async run({ $ }) {
    const recordId = this.recordId ?? undefined;
    if (!recordId) {
      return commonActions.createRecord(this, $);
    } else {
      return commonActions.updateRecord(this, $);
    }
  },
};
