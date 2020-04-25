const airtable = {
  type: "app",
  app: "airtable",
  propDefinitions: {
    baseId: {
      // after should be array + assume after apps
      type: "string",
      // options needs to support standardized opts for pagination
      async options(opts) {
        const bases = await this.getBases(this.$auth.api_key)
        // XXX short hand where value and label are same value
        return bases.map(base => {
          return { label: base.name, value: base.id }
        })
      },
      // XXX validate
    },
    tableId: {
      // after should be array + assume after apps
      type: "string",
      // options needs to support standardized opts for pagination
      async options(opts) {
        const tables = await this.getTables(this.$auth.api_key, opts.baseId)
        // XXX short hand where value and label are same value
        return tables.map(table => {
          return { label: table.name, value: table.id }
        })
      },
      // XXX validate
    },
    viewId: {
      // after should be array + assume after apps
      type: "string",
      // options needs to support standardized opts for pagination
      async options(opts) {
        const views = await this.getViews(this.$auth.api_key, opts.baseId, opts.tableId)
        // XXX short hand where value and label are same value
        return views.map(view => {
          return { label: view.name, value: view.id }
        })
      },
      // XXX validate
    },
  },
  methods: {
    async _makeRequest(config) {
      //if (!config.headers) config.headers = {}
      //const authorization = await this._getAuthorizationHeader(config)
      //config.headers.authorization = authorization
      try {
        return await axios(config)
      } catch (err) {
        console.log(err) // TODO
      }
    },
    async getBases(api_key) {   
      return (await this._makeRequest({
        url: `https://enpvfiy6vfdjnr8.m.pipedream.net/`,
        method: `POST`,
        data: {
          api_key,
        }
      })).data
    },
    async getTables(api_key, base_id) {   
      return (await this._makeRequest({
        url: `https://enm6t8i2xhvrp75.m.pipedream.net`,
        method: `POST`,
        data: {
          api_key,
          base_id,
        }
      })).data
    },
    async getViews(api_key, base_id, table_id) {   
      const data = (await this._makeRequest({
        url: `https://enm6t8i2xhvrp75.m.pipedream.net`,
        method: `POST`,
        data: {
          api_key,
          base_id,
        }
      })).data
      return data.filter(table => table.id === table_id)[0].views
    },
    webhooks: {
      async create() {
        // not yet supported by airtable
      },
      async delete(id) {
        // not yet supported by airtable
      },
    },
  },
}
const moment = require('moment')
const axios = require('axios')
const _ = require('lodash')

module.exports = {
  name: "new-records",
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