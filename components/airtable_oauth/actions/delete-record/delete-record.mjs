import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "airtable_oauth-delete-record",
  name: "Delete Record",
  description: "Delete a selected record from a table. [See the documentation](https://airtable.com/developers/web/api/delete-record)",
  version: "0.0.13",
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
    const baseId = this.baseId?.value ?? this.baseId;
    const tableId = this.tableId?.value ?? this.tableId;
    const recordId = this.recordId?.value ?? this.recordId;

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

    $.export("$summary", `Deleted record "${this.recordId?.label || recordId}" from ${this.baseId?.label || baseId}: [${this.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId})`);
    return response;
  },
};
