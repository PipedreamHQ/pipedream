const airtable=require('../../airtable.app.js')
const axios = require('axios')

module.exports = {
  key: "airtable-update-record",
  name: "Update record",
  description: "Update a record in a table by `record_id`.",
  version: "0.0.4",
  type: "action",
  props: {
    airtable,
    baseId: {type: "$.airtable.baseId", appProp: 'airtable'},
    tableId: { type: '$.airtable.tableId', baseIdProp: 'baseId' },
    recordId: { propDefinition: [airtable, "recordId"] },
    record: { propDefinition: [airtable, "record"] },
  },
  async run() {
    const data = {
      records: [{
        id: this.recordId,
        fields: this.record
      }]
    }    
    const config = {
      method: "patch",
      url: `https://api.airtable.com/v0/${encodeURIComponent(this.baseId)}/${encodeURIComponent(this.tableId)}`,
      headers: {
        Authorization: `Bearer ${this.airtable.$auth.api_key}`,
      },
      data,
    }
    return (await axios(config)).data.records[0]
  },
}