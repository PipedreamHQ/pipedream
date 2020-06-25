const airtable = require('https://github.com/PipedreamHQ/pipedream/components/airtable/airtable.app.js')
const moment = require('moment')
const axios = require('axios')

module.exports = {
  name: "New or modified records in view",
  version: "0.0.2",
  props: {
    db: "$.service.db",
    airtable,
    baseId: { type: "$.airtable.baseId", appProp: "airtable" },
    tableId: { type: "$.airtable.tableId", baseIdProp: "baseId" },
    viewId: { type: "$.airtable.viewId", tableIdProp: "tableId" },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  async run(event) {
    const config = {
      url: `https://api.airtable.com/v0/${encodeURIComponent(this.baseId)}/${encodeURIComponent(this.tableId)}`,
      params: {
        view: this.viewId,
      },
      headers: {
        Authorization: `Bearer ${this.airtable.$auth.api_key}`,
      },
    }

    
    const lastTimestamp = this.db.get("lastTimestamp")
    if (lastTimestamp) {
      config.params.filterByFormula = `LAST_MODIFIED_TIME() > "${lastTimestamp}"`
    }
    const timestamp = new Date().toISOString()
    const { data } = await axios(config)

    if (!data.records.length) {
      console.log(`No new or modified records.`)
      return
    }

    const { baseId, tableId, viewId } = this
    const metadata = {
      baseId,
      tableId,
      viewId
    }

    let newRecords = 0, modifiedRecords = 0
    for (let record of data.records) {
      if(!lastTimestamp || moment(record.createdTime) > moment(lastTimestamp)) {
        record.type = "new_record"
        newRecords++
      } else {
        record.type = "record_modified"
        modifiedRecords++
      }

      record.metadata = metadata

      this.$emit(record, {
        summary: `${record.type}: ${JSON.stringify(record.fields)}`,
        id: record.id,
      })
    }
    console.log(`Emitted ${newRecords} new records(s) and ${modifiedRecords} modified record(s).`)
    this.db.set("lastTimestamp", timestamp)
  },
}