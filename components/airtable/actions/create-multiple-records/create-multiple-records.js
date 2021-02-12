const airtable=require('../../airtable.app.js')
const axios = require('axios')

module.exports = {
  key: "airtable-create-multiple-records",
  name: "Create Multiple Records",
  description: "Create multiple records in a table.",
  version: "0.0.6",
  type: "action",
  props: {
    airtable,
    baseId: {type: "$.airtable.baseId", appProp: 'airtable'},
    tableId: { type: '$.airtable.tableId', baseIdProp: 'baseId' },
    records: { propDefinition: [airtable, "records"] },
  },
  async run() {
    const records = []

    this.records.forEach(record => { records.push({ fields: record }) })
    
    const data = { records }

    const config = {
      method: "post",
      url: `https://api.airtable.com/v0/${encodeURIComponent(this.baseId)}/${encodeURIComponent(this.tableId)}`,
      headers: {
        Authorization: `Bearer ${this.airtable.$auth.api_key}`,
      },
      data,
    }

    return (await axios(config)).data
  },
}