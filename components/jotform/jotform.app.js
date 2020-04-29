const axios = require('axios')
const fetch = require('node-fetch')

module.exports = {
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
      //if (!config.headers) config.headers = {}
      //const authorization = await this._getAuthorizationHeader(config)
      //config.headers.authorization = authorization
      try {
        return await axios(config)
      } catch (err) {
        console.log(err) // TODO
      }
    },
    async getForms(apiKey) {   
      return (await this._makeRequest({
        url: `https://api.jotform.com/user/forms`,
        method: `GET`,
        headers: {
          "APIKEY": apiKey,
        }
      })).data
    },
    async createHook({ apiKey, formId, endpoint }) {
      const updatedEndpoint = `${endpoint}/`
      const url = `https://api.jotform.com/form/${formId}/webhooks?apiKey=${apiKey}&webhookURL=${encodeURIComponent(updatedEndpoint)}`
      console.log(url)
      const method = "POST"
      const data = await fetch(url, { 
        method, 
      })
      const response = await data.json()
      console.log(response)
      return response
    },
    async deleteHook({ formId, hookId, apiKey }) {
      const url = `https://api.jotform.com/form/${formId}/webhooks/0?apiKey=${apiKey}`
      console.log(url)
      const method = "DELETE" 
      const data = await fetch(url, { 
        method, 
      })
      const response = await data.json()
      console.log(response)
      return response
      /*
      console.log(url)
      const response = (await this._makeRequest({
        method: "DELETE",
        url,
      }))
      console.log(response)
      return response
      */
    },
  },
}