const airtable=require('../../airtable.app.js')
const chunk = require('lodash.chunk')
const Airtable = require('airtable')

module.exports = {
  key: "airtable-create-multiple-records",
  name: "Create Multiple Records",
  description: "Create one or more records in a table by passing an array of objects containing field names and values as key/value pairs.",
  version: "0.0.29",
  type: "action",
  props: {
    airtable,
    baseId: {type: "$.airtable.baseId", appProp: 'airtable'},
    tableId: { type: '$.airtable.tableId', baseIdProp: 'baseId' },
    records: { propDefinition: [airtable, "records"] },
  },
  methods: {
    async addRecords(records) {
      const base = new Airtable({apiKey: this.airtable.$auth.api_key}).base(this.baseId);
      return await base(this.tableId).create(records)
    },
  },
  async run() {
    const records = []
    let response_records = []
    const BATCH_SIZE = 10; // Airtable API allows to update up to 10 rows per request.

    let inputRecords = this.records

    if(!Array.isArray(inputRecords)) {
      inputRecords = JSON.parse(inputRecords)
    }

    inputRecords.forEach(record => { records.push({ fields: record }) })
    
    const records_sets = chunk(records, BATCH_SIZE)
    for (const records_set of records_sets) {        
      response_records = response_records.concat((await this.addRecords(records_set)))
    }

    return response_records;
  },
}