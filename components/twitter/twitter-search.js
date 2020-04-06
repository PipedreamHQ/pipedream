const twitter = require('https://github.com/PipedreamHQ/pipedream/blob/add-twitter/components/twitter/twitter.js')
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
    twitter,
    searchTerm: "string",
  },
  events: {
    async default(event) {
      const since_id = this.db.get("since_id") || 0
      //const oauthSignerUri = this.twitter.$auth.oauth_signer_uri
      const tweet_mode = 'extended'
      const count = '100'

      const response = this.twitter.methods.search(this.searchTerm, since_id, tweet_mode, count)

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