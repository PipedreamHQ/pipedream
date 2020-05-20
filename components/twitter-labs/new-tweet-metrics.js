const twitterlabs = {
  type: "app",
  app: "twitter_developer_app",
}

const axios = require('axios')

module.exports = {
  name: "new tweet metrics",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 120,
      },
    },
    id: "string",
    twitterlabs,
  },

  async run(event) {
    const Twit = require('twit')
    const { api_key, api_secret_key, access_token, access_token_secret } = this.twitterlabs.$auth
    const T = new Twit({
      consumer_key: api_key,
      consumer_secret: api_secret_key,
      access_token,
      access_token_secret,
      timeout_ms: 60 * 1000,
      strictSSL: true,
    })
   
    const metrics = (await T.get('https://api.twitter.com/labs/1/tweets/metrics/private', { ids: this.id })).data
    
    const lastmetrics = this.db.get("lastmetrics")
    
    if (JSON.stringify(metrics.data[0]) != lastmetrics) {
      this.$emit(metrics.data[0],{       
        id: metrics.data[0].tweet_id,
        summary: JSON.stringify(metrics.data[0].tweet),
      }) 
      this.db.set("lastmetrics", JSON.stringify(metrics.data[0]))
    }
  }
}
