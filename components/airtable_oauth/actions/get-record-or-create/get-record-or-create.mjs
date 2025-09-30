import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";
import commonActions from "../../common/actions.mjs";

export default {
  key: "airtable_oauth-get-record-or-create",
  name: "Get Record Or Create",
  description: "Get a specific record, or create one if it doesn't exist. [See the documentation](https://airtable.com/developers/web/api/create-records)",
  version: "0.0.15",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    },
    typecast: {
      propDefinition: [
        airtable,
        "typecast",
      ],
      optional: true,
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
