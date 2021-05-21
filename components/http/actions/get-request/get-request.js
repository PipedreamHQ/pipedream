const axios = require('axios')
const http = require('../../http.app.js')

module.exports = {  
  key: "http-get-request",
  name: "GET Request",
  description: "Make an HTTP `GET` request to any URL. Optionally configure query string parameters, headers and basic auth.",
  type: "action",
  version: "0.0.18",
  props: {
    http,
    url: { propDefinition: [http, "url"] },
    params: { propDefinition: [http, "params"] },
    headers: { propDefinition: [http, "headers"] },
    auth: { propDefinition: [http, "auth"] },
  },
  methods: {},
  async run() {
    const config = {
      url: this.url,
      method: "GET",
      params: this.params,
      headers: this.headers,
    }
    if (this.auth) config.auth = this.http.parseAuth(this.auth)
    return (await axios(config)).data
  },
}