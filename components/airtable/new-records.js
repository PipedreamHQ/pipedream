const airtable = require('https://github.com/PipedreamHQ/pipedream/components/airtable/airtable.app.js')
const moment = require('moment')
const axios = require('axios')

module.exports = {
  name: "new-records",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
    airtable,
    baseId: { type: "$.airtable.baseId", appProp: "airtable" },
    tableId: { type: "$.airtable.tableId", baseIdProp: "baseId" },
  },
  async run(event) {
    const config = {
      url: `https://api.airtable.com/v0/${encodeURIComponent(this.baseId)}/${encodeURIComponent(this.tableId)}`,
      params: {},
      headers: {
        Authorization: `Bearer ${this.airtable.$auth.api_key}`,
      },
    }

    let maxTimestamp
    const lastMaxTimestamp = this.db.get("lastMaxTimestamp")
    if (lastMaxTimestamp) {
      config.params.filterByFormula = `CREATED_TIME() > "${lastMaxTimestamp}"`
      maxTimestamp = lastMaxTimestamp
    }

    const { data } = await axios(config)

    if (!data.records.length) {
      console.log(`No new records.`)
      return
    }

    let recordCount = 0
    for (let record of data.records) {
      this.$emit(record, {
        ts: moment(record.createdTime).valueOf(),
        summary: JSON.stringify(record.fields),
        id: record.id,
      })
      if (!maxTimestamp || moment(record.createdTime).valueOf() > moment(maxTimestamp).valueOf()) {
        maxTimestamp = record.createdTime
      }
      recordCount++
    }
    console.log(`Emitted ${recordCount} new records(s).`)
    this.db.set("lastMaxTimestamp", maxTimestamp)
  },
}
