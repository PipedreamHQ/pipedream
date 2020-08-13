const twitter = require('https://github.com/PipedreamHQ/pipedream/components/twitter/twitter.app.js')
const moment = require('moment')
 
module.exports = { 
  name: "My Tweets",
  description: "Emit new Tweets you post to Twitter", 
  version: "0.0.1",
  props: {
    db: "$.service.db",
    twitter,
    q: { propDefinition: [twitter, "keyword_filter"] },
    result_type: { propDefinition: [twitter, "result_type"] },
    includeRetweets: { propDefinition: [twitter, "includeRetweets"] },
    includeReplies: { propDefinition: [twitter, "includeReplies"] },
    lang: { propDefinition: [twitter, "lang"] },
    locale: { propDefinition: [twitter, "locale"] },
    geocode: { propDefinition: [twitter, "geocode"] },
    enrichTweets: { propDefinition: [twitter, "enrichTweets"] },
    count: { propDefinition: [twitter, "count"] },
    maxRequests: { propDefinition: [twitter, "maxRequests"] },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {
    const account = await this.twitter.verifyCredentials()
    const from = `from:${account.screen_name}`
    const since_id = this.db.get("since_id")
    const { lang, locale, geocode, result_type, enrichTweets, includeReplies, includeRetweets, maxRequests, count } = this
    let q = from, max_id, limitFirstPage
    
    // join "from" filter and search keywords
    if (this.q) {
      q += ` ${this.q}`
    }

    if (!since_id) {
      limitFirstPage = true
    } else {
      limitFirstPage = false
    }

    // run paginated search
    const tweets = await this.twitter.paginatedSearch({ 
      q, 
      since_id, 
      lang, 
      locale, 
      geocode, 
      result_type, 
      enrichTweets, 
      includeReplies, 
      includeRetweets, 
      maxRequests,
      count,
      limitFirstPage,
    })

    // emit array of tweet objects
    if(tweets.length > 0) {
      tweets.sort(function(a, b){return a.id - b.id})

      tweets.forEach(tweet => {
        this.$emit(tweet, {
          ts: moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf(),
          summary: tweet.full_text || tweet.text,
          id: tweet.id_str,
        })

        if (tweet.id_str > max_id || !max_id) {
          max_id = tweet.id_str
        }
      })
    } 
    if (max_id) {
      this.db.set("since_id", max_id)
    }
  },
}