const airtable = require("../../airtable.app.js");

module.exports = {
  key: "airtable-get-record",
  name: "Get Record",
  description: "Get a record from a table by `record_id`.",
  version: "0.0.7",
  type: "action",
  props: {
    airtable,
    baseId: {
      type: "$.airtable.baseId",
      appProp: "airtable",
    },
    tableId: {
      type: "$.airtable.tableId",
      baseIdProp: "baseId",
    },
    recordId: {
      propDefinition: [
        airtable,
        "recordId",
      ],
    },
  },
  async run() {
    const table = this.airtable.api(this.baseId, this.tableId);
    return await table.find(this.recordId);
  },
};
