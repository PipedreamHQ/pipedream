const axios = require('axios')

module.exports = {
  type: "app",
  app: "calendly",
  methods: {
    async _makeRequest(opts) {
      const { path } = opts
      delete opts.path
      opts.url = `https://calendly.com${path[0] === "/" ? "" : "/"}${path}`
      opts.data = opts.payload
      delete opts.payload
      opts.headers = {
        "X-TOKEN": this.$auth.api_key,
      }
      console.log(opts)
      return await axios(opts)
    },
    async createHook(opts) {      
      return (await this._makeRequest({
        path: `/api/v1/hooks`,
        method: 'POST',
        payload: opts
      })).data
    },
    async deleteHook(opts) {      
      const result = (await this._makeRequest({
        path: `/api/v1/hooks/${opts.hookId}`,
        method: 'DELETE',
      })).data
      console.log(result)
      return result
    }, 
  }
}
