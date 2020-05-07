const airtable = require('https://github.com/PipedreamHQ/pipedream/components/airtable/airtable.app.js')
const moment = require('moment')
const axios = require('axios')

module.exports = {
  name: "new-or-modified-records",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    airtable,
    baseId: { type: "$.airtable.baseId", appProp: "airtable" },
    tableId: { type: "$.airtable.tableId", baseIdProp: "baseId" },
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
      params: {},
      headers: {
        Authorization: `Bearer ${this.airtable.$auth.api_key}`,
      },
    }

    const timestamp = new Date().toISOString()
    const lastTimestamp = this.db.get("lastTimestamp")
    if (lastTimestamp) {
      config.params.filterByFormula = `LAST_MODIFIED_TIME() > "${lastTimestamp}"`
    }

    const { data } = await axios(config)

    if (!data.records.length) {
      console.log(`No new or modified records.`)
      return
    }

    let newRecords = 0, modifiedRecords = 0, historicalRecords = 0
    for (let record of data.records) {
      if(moment(record.createdTime) > moment(lastTimestamp)) {
        record.type = "new_record"
        newRecords++
      } else {
        if(lastTimestamp) {
          record.type = "record_modified"
          modifiedRecords++
        } else {
          // historical records are emitted on the first execution
          record.type = "historical_record"
          historicalRecords++
        }
      }
      this.$emit(record, {
        summary: `${record.type}: ${JSON.stringify(record.fields)}`,
        id: record.id,
      })
    }
    if (lastTimestamp) {
      console.log(`Emitted ${newRecords} new records(s) and ${modifiedRecords} modified record(s).`)
    } else {
      console.log(`Emitted ${historicalRecords} historical record(s).`)
    }
    this.db.set("lastTimestamp", timestamp)
  },
}