// x-pd-ai: optimized
import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";
import commonActions from "../../common/actions.mjs";

export default {
  key: "airtable_oauth-create-or-update-record",
  name: "Create or Update Record",
  description: "Create a new record, or update an existing one if a Record ID is provided (an upsert). Leave `Record ID` blank to create a record from `record`; supply it to update that record's fields instead. Use **List Tables** to look up field names first, and **List Records** to find an existing record's ID. [See the create-record documentation](https://airtable.com/developers/web/api/create-records) and the [update-record documentation](https://airtable.com/developers/web/api/update-record)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    recordId: {
      propDefinition: [
        airtable,
        "recordId",
      ],
      optional: true,
      description: "To update an existing record, select it from the list or provide its [Record ID](https://support.airtable.com/hc/en-us/articles/360051564873-Record-ID). If left blank, a new record will be created.",
    },
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
    const recordId = this.recordId ?? undefined;
    if (!recordId) {
      return commonActions.createRecord(this, $);
    } else {
      return commonActions.updateRecord(this, $);
    }
  },
};
