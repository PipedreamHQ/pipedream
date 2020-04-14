const twitter = require('https://github.com/PipedreamHQ/pipedream/blob/add-twitter/components/twitter/twitter.app.js')
const _ = require('lodash')

module.exports = {
  name: "twitter-search",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    twitter,
    q: {
      type: "string",
      label: 'Search Term',
      description: "A UTF-8, URL-encoded search query of 500 characters maximum, including operators. Queries may additionally be limited by complexity.",
    },
    result_type: {
      type: "string", 
      label: "Result Type",
      description: `Specifies what type of search results you would prefer to receive.`,
      optional: true,
      options: ['recent', 'popular', 'mixed'],
      default: 'recent',
    },
    includeRetweets: {
      type: "boolean", 
      label: "Include Retweets",
      description: "If true, retweets will be filtered out of the search results returned by Twitter",
      optional: true,
      default: false,
    },
    includeReplies: {
      type: "boolean", 
      label: "Include Replies",
      description: "If false, reeplies will be filtered out before search results are returned by Twitter.",
      optional: true,
      default: true,
    },
    count: {
      type: "string",
      label: "Count",
      description: "The maximum number of tweets to return (up to 100)",
      optional: true,
      default: "100",
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
      if(this.includeRetweets === false) {
        if (_.get(tweet,'retweeted_status.id','') !== '') {
          emitEvent = false
        }
      }
      if(this.includeReplies === false) {
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