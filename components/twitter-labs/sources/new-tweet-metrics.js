const twitterlabs = require('https://github.com/PipedreamHQ/pipedream/components/twitter-labs/twitter-labs.app.js')

const axios = require('axios')

module.exports = {
  name: "new tweet metrics",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900,
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

    const _isEqual = require("lodash.isequal")

    const metrics = (await T.get('https://api.twitter.com/labs/1/tweets/metrics/private', { ids: this.id })).data.data[0]
    const lastmetrics = this.db.get("lastmetrics")
    if (lastmetrics && _isEqual(lastmetrics, metrics)) return
    this.$emit(metrics,{       
      id: metrics.tweet_id,
      summary: JSON.stringify(metrics.tweet),
    }) 
    this.db.set("lastmetrics", metrics)

  }
}
