const airtable = require("../../airtable.app.js");
const common = require("../common.js");

module.exports = {
  key: "airtable-create-single-record",
  name: "Create single record",
  description: "Adds a record to a table.",
  version: "0.1.1",
  type: "action",
  props: {
    ...common.props,
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
    const table = this.airtable.base(this.baseId)(this.tableId);

    this.airtable.validateRecord(this.record);

    const data = [
      {
        fields: this.record,
      },
    ];

    const params = {
      typecast: this.typecast,
    };

    try {
      const [
        response,
      ] = await table.create(data, params);
      return response;
    } catch (err) {
      this.airtable.throwFormattedError(err);
    }
  },
};
