import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";
import commonActions from "../../common/actions.mjs";

export default {
  key: "airtable_oauth-create-or-update-record",
  name: "Create or Update Record",
  description: "Create a new record or update an existing one. [See the documentation](https://airtable.com/developers/web/api/create-records)",
  version: "0.1.1",
  type: "action",
  props: {
    ...common.props,
    tableId: {
      ...common.props.tableId,
      reloadProps: true,
    },
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
      optional: true,
      description: "To update an existing record, select it from the list or provide its [Record ID](https://support.airtable.com/hc/en-us/articles/360051564873-Record-ID). If left blank, a new record will be created.",
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
    const recordId = this.recordId ?? undefined;
    if (!recordId) {
      return commonActions.createRecord(this, $);
    } else {
      return commonActions.updateRecord(this, $);
    }
  },
};
