const twitter = require('https://github.com/PipedreamHQ/pipedream/components/twitter/twitter.app.js')
const _ = require('lodash')
const axios = require('axios')
const moment = require('moment')

module.exports = { 
  name: "my-tweets", 
  version: "0.0.1",
  props: {
    db: "$.service.db",
    twitter,
    q: { propDefinition: [twitter, "keyword_filter"] },
    result_type: { propDefinition: [twitter, "result_type"] },
    count: { propDefinition: [twitter, "count"] },
    includeRetweets: { propDefinition: [twitter, "includeRetweets"] },
    includeReplies: { propDefinition: [twitter, "includeReplies"] },
    enrichTweets: { propDefinition: [twitter, "enrichTweets"] },
    lang: { propDefinition: [twitter, "lang"] },
    locale: { propDefinition: [twitter, "locale"] },
    geocode: { propDefinition: [twitter, "geocode"] },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {
    const account = await this.twitter.verifyCredentials()
    const from = account.screen_name
    
    let q = ''

    if(this.q) {
      q = this.q
    }
    
    const since_id = this.db.get("since_id") || 0
    const tweet_mode = 'extended'
    const result_type = this.result_type
    const { count, lang, locale, geocode } = this

    if(this.includeReplies === false) {
      q = `${q} -filter:replies`
    }

    // join "from" filter and search keywords
    q = `${from} ${q}`

    const response = await this.twitter.search(q.trim(), since_id, tweet_mode, count, result_type, lang, locale, geocode)

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