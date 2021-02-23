const airtable=require('../../airtable.app.js')
const axios = require('axios')
const chunk = require('lodash.chunk')


module.exports = {
  key: "airtable-create-multiple-records",
  name: "Create Multiple Records",
  description: "Create multiple records in a table.",
  version: "0.0.17",
  type: "action",
  props: {
    airtable,
    baseId: {type: "$.airtable.baseId", appProp: 'airtable'},
    tableId: { type: '$.airtable.tableId', baseIdProp: 'baseId' },
    records: { propDefinition: [airtable, "records"] },
  },
  methods: {
    async addRecords(records) {
      const data = { records }

      const config = {
        method: "post",
        url: `https://api.airtable.com/v0/${encodeURIComponent(this.baseId)}/${encodeURIComponent(this.tableId)}`,
        headers: {
          Authorization: `Bearer ${this.airtable.$auth.api_key}`,
        },
        data,
      }

      return (await axios(config)).data.records
    },
  },
  async run() {
    const records = []
    let response_records = []
    const BATCH_SIZE = 10; // Airtable API allows to update up to 10 rows per request.

    this.records.forEach(record => { records.push({ fields: record }) })
    
    const records_sets = chunk(records, BATCH_SIZE)
    for (const records_set of records_sets) {        
      response_records = response_records.concat((await this.addRecords(records_set)))
    }

    return response_records;
  },
}