const axios = require("axios")
const querystring = require('querystring')

module.exports = { 
  type: "app", 
  app: "typeform", 
  propDefinitions: {  
    formId: {
      type: "string",
      label: "Form",
      async options({ page }) {
        const forms = await this.getForms({
          page: page + 1, // pipedream page 0-indexed, typeform is 1
          page_size: 200,
        })
        return forms.items.map(form => {
         return { label: form.title, value: form.id }
        })
      },
    },
  }, 
  methods: {
    async _makeRequest(config) {
      if (config.params) { 
        const query = querystring.stringify(config.params)
        delete config.params
        const sep = config.url.indexOf('?') === -1 ? '?' : '&'
        config.url += `${sep}${query}`
        config.url = config.url.replace('?&','?')
      }
      if (!config.headers) config.headers = {}
      config.headers.Authorization = `Bearer ${this.$auth.oauth_access_token}`
      return await axios(config)
    },
    async getForms(opts = {}) {   
      return (await this._makeRequest({
        url: `https://api.typeform.com/forms`,
        method: `GET`,
        params: opts
      })).data
    }, 
    async createHook(opts = {}) {
      const { formId, endpoint, tag, secret } = opts
      return (await this._makeRequest({
        method: "put",
        url: `https://api.typeform.com/forms/${encodeURIComponent(formId)}/webhooks/${encodeURIComponent(tag)}`,
        data: {
          url: endpoint,
          enabled: true,
          verify_ssl: true,
          secret,
        },
      })).data
    },
    async deleteHook(opts = {}) {
      const { formId, tag } = opts
      return (await this._makeRequest({
        method: "delete",
        url: `https://api.typeform.com/forms/${encodeURIComponent(formId)}/webhooks/${encodeURIComponent(tag)}`,
      })).data
    },
  },
}