const airtable = require("../../airtable.app.js");
const common = require("../common.js");

module.exports = {
  key: "airtable-update-record",
  name: "Update record",
  description: "Update a single record in a table by Record ID.",
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
    record: {
      propDefinition: [
        airtable,
        "record",
      ],
    },
  },
  async run() {
    this.airtable.validateRecordID(this.recordId);
    const base = this.airtable.base(this.baseId);
    try {
      return (await base(this.tableId).update([
        {
          id: this.recordId,
          fields: this.record,
        },
      ]))[0];
    } catch (err) {
      this.airtable.throwFormattedError(err);
    }
  },
};
