const axios = require('axios')
const querystring = require('querystring')
 
const jotform = { 
  type: "app", 
  app: "jotform", 
  propDefinitions: {  
    formId: {
      // after should be array + assume after apps
      type: "string", 
      label: "Form", 
      // options needs to support standardized opts for pagination
      async options(opts) { 
        const forms = await this.getForms(this.$auth.api_key)  
        // XXX short hand where value and label are same value
        return forms.content.map(form => { 
          return { label: form.title, value: form.id } 
        }) 
      },
      // XXX validate  
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
      try {
        return await axios(config)
      } catch (err) {
        console.log(err) // TODO
      }
    },
    async getForms() {   
      return (await this._makeRequest({
        url: `https://api.jotform.com/user/forms`,
        method: `GET`,
        headers: {
          "APIKEY": this.$auth.api_key,
        },
      })).data
    }, 
    async getWebhooks(opts = {}) {
      const { formId } = opts
      return (await this._makeRequest({
        url: `https://api.jotform.com/form/${formId}/webhooks`,
        method: `GET`,
        headers: {
            "APIKEY": this.$auth.api_key,
          },
      })).data
    },
    async createHook(opts = {}) {
      const { formId, endpoint } = opts
      const updatedEndpoint = `${endpoint}/`
      return (await this._makeRequest({ 
        url: `https://api.jotform.com/form/${formId}/webhooks`,
        method: `POST`, 
        headers: {
            "APIKEY": this.$auth.api_key,
          },
        params: {
          webhookURL: encodeURI(updatedEndpoint),
        },
      }))
    },
    async deleteHook(opts = {}) { 
      const { formId, endpoint } = opts
      const updatedEndpoint = `${endpoint}/`
      const webhooks = (await this.getWebhooks({ formId })).content
      let webhookId = -1
      for (let id in webhooks) {
        if (webhooks[id] === updatedEndpoint) {
          webhookId = id
        }
      }
      if(webhookId !== -1) {
        console.log(`Deleting webhook ID ${webhookId}...`)
        return (await this._makeRequest({ 
          url: `https://api.jotform.com/form/${formId}/webhooks/${webhookId}`,
          method: `DELETE`, 
          headers: {
            "APIKEY": this.$auth.api_key,
          },
        }))
      } else {
        console.log(`Could not detect webhook ID.`)
      }
    },
  },
}