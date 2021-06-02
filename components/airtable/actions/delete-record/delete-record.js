const airtable = require("../../airtable.app.js");
const common = require("../common.js");

module.exports = {
  key: "airtable-delete-record",
  name: "Delete Record",
  description: "Delete a record from a table by record ID.",
  version: "0.1.0",
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
  async run() {
    this.airtable.validateRecordID(this.recordId);
    const base = this.airtable.base(this.baseId);
    try {
      return await base(this.tableId).destroy(this.recordId);
    } catch (err) {
      this.airtable.throwFormattedError(err);
    }
  },
};
