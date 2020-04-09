const _ = require('./node_modules/lodash')
const axios = require('./node_modules/axios')
const pdsdk = require("./node_modules/@pipedreamhq/sdk")

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))
  
module.exports = {
  name: "github-search",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      intervalSeconds: 60 * 60 * 24 * 365,
    },
    github: {
      type: "app",
      app: "github",
    },
    q: "string",
    sort: "string",
  },
  async run(events) {
    //See the API docs here: https://developer.github.com/v3/search/#search-issues-and-pull-requests
    const config = {
      url: `https://api.github.com/search/issues`,
      params: {
        q: this.q,
        sort: this.sort,
      },
      headers: {
        Authorization: `Bearer ${this.github.$auth.oauth_access_token}`,
      },
    }
    const response = await require("./node_modules/@pipedreamhq/platform").axios(this, config)
    console.log(response)

    for(let i=0; i<response.items.length; i++) {
      //this.$emit(response.items[i])
      pdsdk.sendEvent("enysoeoj1prwkkd", response.items[i])
      console.log(response.items[i])
      if(i < response.items.length-1){
        await snooze(1000)
      }
    }
  },
}