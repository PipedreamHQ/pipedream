const axios = require('axios')
const http = require('../../http.app.js')

module.exports = {  
  key: "http-get-request",
  name: "GET Request",
  type: "action",
  version: "0.0.3",
  props: {
    http,
    url: { propDefinition: [http, "url"] },
    params: { propDefinition: [http, "params"] },
    headers: { propDefinition: [http, "headers"] },
    auth: { propDefinition: [http, "auth"] },
    responseType: { propDefinition: [http, "responseType"] },
  },
  methods: {},
  async run() {
    const config = {
      url: this.url,
      method: "GET",
      params: this.query,
      headers: this.headers,
      responseType: this.responseType,
    }
    if (this.auth) config.auth = this.auth
    return await axios(config)
  },
}