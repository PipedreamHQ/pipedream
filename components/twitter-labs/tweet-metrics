const twitter-labs = {
  type: "app",
  app: "twitter_developer_app",
}

const axios = require('axios')

module.exports = {
  name: "tweet metrics",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    keyword: "string",
    twitter-labs,
  },

async run(event) {
  const Twit = require('twit')
  const { api_key, api_secret_key, access_token, access_token_secret } = this.twitter_developer_app.$auth
  const T = new Twit({
    consumer_key: api_key,
    consumer_secret: api_secret_key,
    access_token,
    access_token_secret,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,  // optional - requires SSL certificates to be valid.
  })
   
  return (await T.get('https://api.twitter.com/labs/1/tweets/metrics/private', { ids: params.id })).data

  this.$emit(T_event,{       
    id: T.data[0].tweet_id,
    summary: T.data[0].tweet.impression_count,
  })    
}
