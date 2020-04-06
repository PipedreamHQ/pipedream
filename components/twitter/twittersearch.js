const axios = require('axios')
const querystring = require("querystring")
const _ = require('lodash')

module.exports = {
  name: "twitter-search",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      intervalSeconds: 60,
    },
    twitter: {
      type: "app",
      app: "twitter",
    },
    searchTerm: "string",
  },
  events: {
    async default(event) {
      const since_id = this.db.get("since_id") || 0
      const oauthSignerUri = this.twitter.$auth.oauth_signer_uri

      const query = querystring.stringify({
        q: this.searchTerm,
        since_id: since_id,
        tweet_mode: 'extended',
        count: '100',
      })

      const requestData = {
          data: '',
          method: 'GET',
          url: `https://api.twitter.com/1.1/search/tweets.json?${query}`,
      }

      const token = {
          key: this.twitter.$auth.access_token,
          secret: this.twitter.$auth.refresh_token,
      }

      const authorization = (await axios({
        method: 'POST',
        url: 'https://enlb0ktwajm8sen.m.pipedream.net?pipedream_response=1',
        data: {
          requestData,
          token,
        }
      })).data

      const response = (await axios({
        method: 'GET',
        url: requestData.url,
        headers: {
          authorization
        }
      })).data

      let maxId = since_id

      response.statuses.forEach(tweet => {
        if (tweet.in_reply_to_status_id === null && tweet.retweet_count === 0) {
          if (_.get(tweet,'retweeted_status','') === '') {
            this.$emit(tweet)
          }
          if (tweet.id > maxId) {
            maxId = tweet.id
          }
        }
      })

      this.db.set("since_id", maxId)
    },
  },
}