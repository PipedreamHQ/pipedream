const twitter = require('../../twitter.app.js')
const moment = require('moment')
 
module.exports = {
  key: "twitter-advanced-search",
  name: "Advanced Search",
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
    lang: { propDefinition: [twitter, "lang"] },
    locale: { propDefinition: [twitter, "locale"] },
    geocode: { propDefinition: [twitter, "geocode"] },
    since_id: { propDefinition: [twitter, "since_id"] },
    enrichTweets: { propDefinition: [twitter, "enrichTweets"] },
    count: { propDefinition: [twitter, "count"] },
    maxRequests: { propDefinition: [twitter, "maxRequests"] },
  }, 
  async run(event) {
    const { lang, locale, geocode, result_type, enrichTweets, includeReplies, includeRetweets, since_id, maxRequests, count } = this
    let q = this.q, max_id, limitFirstPage

    if (!since_id) {
      limitFirstPage = true
    } else {
      limitFirstPage = false
    }
 
    // run paginated search
    return await this.twitter.paginatedSearch({ 
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
  },
}
