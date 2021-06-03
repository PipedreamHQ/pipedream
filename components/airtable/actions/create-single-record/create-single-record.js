const airtable = require("../../airtable.app.js");
const common = require("../common.js");

module.exports = {
  key: "airtable-create-single-record",
  name: "Create single record",
  description: "Adds a record to a table.",
  version: "0.1.0",
  type: "action",
  props: {
    ...common.props,
    record: {
      propDefinition: [
        airtable,
        "record",
      ],
    },
  },
  async run() {
    this.airtable.validateRecord(this.record);
    const base = this.airtable.base(this.baseId);
    try {
      return (await base(this.tableId).create([
        {
          fields: this.record,
        },
      ]))[0];
    } catch (err) {
      this.airtable.throwFormattedError(err);
    }
  },
};
