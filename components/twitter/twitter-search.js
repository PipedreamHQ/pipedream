const twitter = require('https://github.com/PipedreamHQ/pipedream/blob/add-twitter/components/twitter/twitter.app.js')
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
    q: "string",
    result_type: {
      type: "string", 
      options: ['recent', 'popular', 'mixed'],
      default: 'recent',
    },
    includeRetweets: {
      type: "string", 
      options: ['true', 'false'],
      default: 'false',
    },
    includeReplies: {
      type: "string", 
      options: ['true', 'false'],
      default: 'false',
    },
  },
  async run(event) {
    const since_id = this.db.get("since_id") || 0
    const tweet_mode = 'extended'
    const count = '100'
    let query = this.q


    if(this.includeReplies === 'false') {
      query = `${query} -filter:replies`
    }

    const response = await this.twitter.search(query, since_id, tweet_mode, count)

    let maxId = since_id

    response.statuses.forEach(tweet => {
      let emitEvent = true
      if(this.includeRetweets === 'false') {
        if (_.get(tweet,'retweeted_status.id','') !== '') {
          emitEvent = false
        }
      }
      if(this.includeReplies === 'false') {
        if (tweet.in_reply_to_status_id !== null) {
          emitEvent = false
        }
      }
      if (emitEvent === true) {
        this.$emit(tweet)
        if (tweet.id > maxId) {
          maxId = tweet.id
        }
      }
    })

    this.db.set("since_id", maxId)
  },
}