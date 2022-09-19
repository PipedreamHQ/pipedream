import airtable from "../../airtable.app.mjs";
import common from "../common.mjs";

export default {
  key: "airtable-delete-record",
  name: "Delete Record",
  description: "Delete a record from a table by record ID.",
  version: "0.2.0",
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
    const baseId = this.baseId?.value ?? this.baseId;
    const tableId = this.tableId?.value ?? this.tableId;
    const recordId = this.recordId?.value ?? this.recordId;

    this.airtable.validateRecordID(recordId);
    const base = this.airtable.base(baseId);
    let response;
    try {
      response = await base(this.tableId.value).destroy(recordId);
    } catch (err) {
      this.airtable.throwFormattedError(err);
    }

    $.export("$summary", `Deleted record "${this.recordId?.label || recordId}" from ${this.baseId?.label || baseId}: [${this.tableId?.label || tableId}](https://airtable.com/${baseId}/${tableId})`);
    return response;
  },
};
