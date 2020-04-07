const twitter = require('https://github.com/PipedreamHQ/pipedream/blob/add-twitter/apps/twitter.app.js')
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
  async run(events) {
    const since_id = this.db.get("since_id") || 0
    const tweet_mode = 'extended'
    const count = '100'

    const response = await this.twitter.search(this.searchTerm, since_id, tweet_mode, count)

    let maxId = since_id

    console.log(response.statuses)

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
}