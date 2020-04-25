const axios = require('axios')

module.exports = {
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