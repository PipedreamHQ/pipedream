import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "airtable_oauth-delete-record",
  name: "Delete Record",
  description: "Delete a selected record from a table. [See the documentation](https://airtable.com/developers/web/api/delete-record)",
  version: "0.0.16",
  annotations: {
    destructiveHint: true,
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
    },
  },
  async run({ $ }) {
    const {
      baseId, tableId, recordId,
    } = this;

    this.airtable.validateRecordID(recordId);
    let response;
    try {
      response = await this.airtable.deleteRecord({
        baseId,
        tableId,
        recordId,
      });
    } catch (err) {
      this.airtable.throwFormattedError(err);
    }

    $.export("$summary", `Deleted record "${recordId}" from ${baseId}: [${tableId}](https://airtable.com/${baseId}/${tableId})`);
    return response;
  },
};
