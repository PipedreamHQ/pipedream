const airtable = require("../../airtable.app.js");

module.exports = {
  key: "airtable-update-record",
  name: "Update record",
  description: "Update a record in a table by `record_id`.",
  version: "0.0.6",
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
    record: {
      propDefinition: [
        airtable,
        "record",
      ],
    },
  },
  async run() {
    const table = this.airtable.api(this.baseId, this.tableId);

    const data = [
      {
        id: this.recordId,
        fields: this.record,
      },
    ];

    const [
      response,
    ] = await table.update(data);

    return response;
  },
};
