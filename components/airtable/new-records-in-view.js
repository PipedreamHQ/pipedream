const airtable = require('https://github.com/PipedreamHQ/pipedream/components/airtable/airtable.app.js')
const moment = require('moment')
const axios = require('axios')
const _ = require('lodash')

module.exports = {
  name: "new-records-in-view",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    airtable,
    baseId: { propDefinition: [airtable, "baseId"] },
    tableId: { propDefinition: [airtable, "tableId", c => ({ baseId: c.baseId })] },
    viewId: { propDefinition: [airtable, "viewId", c => ({ baseId: c.baseId, tableId: c.tableId })] },
  },
  async run(event) {
      const config = {
        url: `https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(this.tableId)}`,
        params: {
          view: this.viewId,
        },
        headers: {
          Authorization: `Bearer ${this.airtable.$auth.api_key}`,
        },
      }

      let maxTimestamp = ""
      const lastMaxTimestamp = this.db.get("lastMaxTimestamp") || ""
      if (lastMaxTimestamp !== "") {
        _.set(config,"params.filterByFormula", `CREATED_TIME() > "${lastMaxTimestamp}"`)
        maxTimestamp = lastMaxTimestamp
      }

      const response = (await axios(config)).data
      
      if (response.records.length > 0) {
        let recordCount = 0
        for (let record of response.records) {
          this.$emit(record, {
            ts: moment(record.createdTime).valueOf(),
            summary: JSON.stringify(record.fields),
            id: record.id,
          })
          if (maxTimestamp === '') { 
            maxTimestamp = record.createdTime 
          } else if (moment(record.createdTime).valueOf() > moment(maxTimestamp).valueOf()) {
            maxTimestamp = record.createdTime
          }
          recordCount++
        }
        console.log(`Emitted ${recordCount} new records(s).`)
        this.db.set("lastMaxTimestamp", maxTimestamp)
      } else {
        console.log(`No new records.`)
      }
  }, 
}