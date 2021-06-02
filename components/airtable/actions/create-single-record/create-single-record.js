const airtable = require("../../airtable.app.js");

module.exports = {
  key: "airtable-create-single-record",
  name: "Create single record",
  description: "Create a record in a table.",
  version: "0.0.12",
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
    record: {
      propDefinition: [
        airtable,
        "record",
      ],
    },
    typecast: {
      propDefinition: [
        airtable,
        "typecast",
      ],
    },
  },
  async run() {
    const table = this.airtable.api(this.baseId, this.tableId);

    const data = [
      {
        fields: this.record,
      },
    ];

    const params = {
      typecast: this.typecast,
    };

    const [
      response,
    ] = await table.create(data, params);

    return response;
  },
};
