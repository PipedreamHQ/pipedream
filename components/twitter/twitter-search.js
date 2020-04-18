const twitter = {
  type: "app",
  app: "twitter",
  propDefinitions: {
    q: {
      type: "string",
      label: 'Search Term',
      description: "Search for keywords, screen names, or hashtags. You can also use Twitter's standard search operators (https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators).",
    },
    result_type: {
      type: "string", 
      label: "Result Type",
      description: `Specifies the type of results you want to retrieve.`,
      optional: true,
      options: ['recent', 'popular', 'mixed'],
      default: 'recent',
    },
    count: {
      type: "string",
      label: "Count",
      description: "The maximum number of tweets to return (up to 100)",
      optional: true,
      default: "100",
    },
  },
  methods: {
    async _getAuthorizationHeader({ data, method, url }) {
      const requestData = {
        data,
        method,
        url,
      }
      const token = {
        key: this.$auth.oauth_access_token,
        secret: this.$auth.oauth_refresh_token,
      }
      return (await axios({
        method: 'POST',
        url: this.$auth.oauth_signer_uri,
        data: {
          requestData,
          token,
        }
      })).data
    },
    async _makeRequest(config) {
      if (!config.headers) config.headers = {}
      const authorization = await this._getAuthorizationHeader(config)
      config.headers.authorization = authorization
      try {
        return await axios(config)
      } catch (err) {
        console.log(err) // TODO
      }
    },
    async search(q, since_id, tweet_mode, count, result_type) {   
      const query = querystring.stringify({
        q,
        since_id,
        tweet_mode,
        count,
        result_type,
      })
      console.log(query)
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/search/tweets.json?${query}`,
      })).data
    },
    webhooks: {
      // TODO
    },
  },
}

const _ = require('lodash')
const querystring = require("querystring")
const axios = require('axios')

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
    q: { propDefinition: [twitter, "q"] },
    result_type: { propDefinition: [twitter, "result_type"] },
    count: { propDefinition: [twitter, "count"] },
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
  },
  async run(event) {
    let query = this.q
    
    const since_id = this.db.get("since_id") || 0
    const tweet_mode = 'extended'
    const result_type = this.result_type
    const count = this.count

    if(this.includeReplies === 'false') {
      query = `${query} -filter:replies`
    }

    console.log("count: " + count)

    const response = await this.twitter.search(query, since_id, tweet_mode, count, result_type)

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