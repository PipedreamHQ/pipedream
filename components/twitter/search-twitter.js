const twitter = require('https://github.com/PipedreamHQ/pipedream/components/twitter/twitter.app.js')
const _ = require('lodash')
const axios = require('axios')
const moment = require('moment')

module.exports = {
  name: "search-twitter", 
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    twitter,
    q: { propDefinition: [twitter, "q"] },
    result_type: { propDefinition: [twitter, "result_type"] },
    count: { propDefinition: [twitter, "count"] },
    includeRetweets: {
      type: "boolean", 
      label: "Include Retweets",
      description: "If true, retweets will be filtered out of the search results returned by Twitter",
      optional: true,
      default: true,
    },
    includeReplies: {
      type: "boolean", 
      label: "Include Replies",
      description: "If false, replies will be filtered out before search results are returned by Twitter.",
      optional: true,
      default: true,
    },
    enrichTweets: {
      type: "boolean", 
      label: "Enrich Tweets",
      description: "Enrich each tweet with epoch (milliseconds) and ISO8601 conversions of Twitter's `created_at` timestamp.",
      optional: true,
      default: true,
    },
    lang: { propDefinition: [twitter, "lang"] },
    locale: { propDefinition: [twitter, "locale"] },
    geocode: { propDefinition: [twitter, "geocode"] },
  },
  async run(event) {
    let q = this.q
    
    const since_id = this.db.get("since_id") || 0
    const tweet_mode = 'extended'
    const result_type = this.result_type
    const { count, lang, locale, geocode } = this

    if(this.includeReplies === false) {
      q = `${q} -filter:replies`
    }

    const response = await this.twitter.search(q, since_id, tweet_mode, count, result_type, lang, locale, geocode)

    let maxId = since_id

    response.statuses.sort(function(a, b){return moment(a.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf()-moment(b.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf()});

    let filteredRetweets = 0
    let filteredReplies = 0

    for (let tweet of response.statuses) {
      
      if(this.includeRetweets === false) {
        if (_.get(tweet,'retweeted_status.id','') !== '') {
          filteredRetweets++
          continue
        }
      }

      if(this.includeReplies === false) {
        if (tweet.in_reply_to_status_id !== null) {
          filteredReplies++
          continue
        }
      }

      if (tweet.id !== since_id) {
        if (this.enrichTweets) {
          tweet.created_at_timestamp = moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf()
          tweet.created_at_iso8601 = moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').toISOString()
        }

        this.$emit(tweet, {
          ts: moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf(),
          summary: tweet.full_text || tweet.text,
          id: tweet.created_at_timestamp,
        })
        if (tweet.id > maxId) {
          maxId = tweet.id
        }
      }
    }

    if (filteredRetweets > 0) { console.log(`Filtered out ${filteredRetweets} retweets from search results.`) }
    if (filteredReplies > 0) { console.log(`Filtered out ${filteredReplies} replies from search results.`) }
    this.db.set("since_id", maxId)
  },
}