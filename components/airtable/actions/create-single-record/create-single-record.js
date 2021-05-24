const airtable = require("../../airtable.app.js");

module.exports = {
  key: "airtable-create-single-record",
  name: "Create single record",
  description: "Create a record in a table.",
  version: "0.0.11",
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
      type: "boolean",
      description: "The Airtable API will perform best-effort automatic data conversion from string values if the typecast parameter is `True`. Automatic conversion is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources.",
    },
  },
  async run() {
    const Airtable = require("airtable");
    const a = new Airtable({
      apiKey: this.airtable.$auth.api_key,
    });
    const table = a.base(this.baseId)(this.tableId);
    const args = [
      [
        {
          fields: this.record,
        },
      ],
      {
        typecast: this.typecast,
      },
    ];
    return (await table.create(...args))[0];
  },
};
