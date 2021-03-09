const airtable=require('../../airtable.app.js')

module.exports = {
  key: "airtable-create-single-record",
  name: "Create single record",
  description: "Create a record in a table.",
  version: "0.0.11",
  type: "action",
  props: {
    airtable,
    baseId: {type: "$.airtable.baseId", appProp: 'airtable'},
    tableId: { type: '$.airtable.tableId', baseIdProp: 'baseId' },
    record: { propDefinition: [airtable, "record"] },
  },
  async run() {
    const Airtable = require('airtable');
    const base = new Airtable({apiKey: this.airtable.$auth.api_key}).base(this.baseId);
    return (await base(this.tableId).create([{
      fields: this.record
    }]))[0]
  },
}