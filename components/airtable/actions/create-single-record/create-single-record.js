const airtable=require('../../airtable.app.js')
const axios = require('axios')

module.exports = {
  key: "airtable-create-single-record",
  name: "Create single record",
  description: "Create a record in a table.",
  version: "0.0.4",
  type: "action",
  props: {
    airtable,
    baseId: {type: "$.airtable.baseId", appProp: 'airtable'},
    tableId: { type: '$.airtable.tableId', baseIdProp: 'baseId' },
    record: { propDefinition: [airtable, "record"] },
  },
  async run() {
    const data = {
      records: [{
        fields: this.record
      }]
    }    
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