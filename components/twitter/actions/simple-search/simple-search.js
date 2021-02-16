const twitter = require('../../twitter.app.js')
const moment = require('moment')
 
module.exports = {
  key: "twitter-simple-search",
  name: "Simple Search",
  description: "Return Tweets that matches your search criteria.", 
  version: "0.0.2",
  type: "action",
  props: {
    db: "$.service.db",
    twitter,
    q: { propDefinition: [twitter, "q"] },
    result_type: { propDefinition: [twitter, "result_type"] },
    includeRetweets: { propDefinition: [twitter, "includeRetweets"] },
    includeReplies: { propDefinition: [twitter, "includeReplies"] },
    enrichTweets: { propDefinition: [twitter, "enrichTweets"] },
    count: { propDefinition: [twitter, "count"] },
    maxRequests: { propDefinition: [twitter, "maxRequests"] },
  }, 
  async run(event) {
    const { result_type, enrichTweets, includeReplies, includeRetweets, maxRequests, count } = this
    let q = this.q, max_id, limitFirstPage

    limitFirstPage = true
 
    // run paginated search
    return await this.twitter.paginatedSearch({ 
      q, 
      result_type, 
      enrichTweets, 
      includeReplies, 
      includeRetweets, 
      maxRequests,
      count,
      limitFirstPage,
    })

    /*
    // return response
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
    */
  },
}
