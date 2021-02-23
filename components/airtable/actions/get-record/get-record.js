const airtable=require('../../airtable.app.js')
const axios = require('axios')

module.exports = {
  key: "airtable-get-record",
  name: "Get Record by ID",
  description: "Get a record from a table by `record_id`.",
  version: "0.0.1",
  type: "action",
  props: {
    airtable,
    baseId: {type: "$.airtable.baseId", appProp: 'airtable'},
    tableId: { type: '$.airtable.tableId', baseIdProp: 'baseId' },
    recordId: { propDefinition: [airtable, "recordId"] },
  },
  async run() { 
    const config = {
      method: "get",
      url: `https://api.airtable.com/v0/${encodeURIComponent(this.baseId)}/${encodeURIComponent(this.tableId)}/${encodeURIComponent(this.recordId)}`,
      headers: {
        Authorization: `Bearer ${this.airtable.$auth.api_key}`,
      },
    }
    return (await axios(config)).data
  },
}