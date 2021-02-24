const twitter = require('../../twitter.app.js')
const moment = require('moment')
 
module.exports = {
  key: "twitter-simple-search",
  name: "Simple Search",
  description: "Return Tweets that matches your search criteria.", 
  version: "0.0.5",
  type: "action",
  props: {
    db: "$.service.db",
    twitter,
    q: { propDefinition: [twitter, "q"] },
    result_type: { propDefinition: [twitter, "result_type"] },
    includeRetweets: { propDefinition: [twitter, "includeRetweets"] },
    includeReplies: { propDefinition: [twitter, "includeReplies"] },
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
  },
}
