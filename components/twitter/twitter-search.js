const twitter = require('https://github.com/PipedreamHQ/pipedream/blob/add-twitter/components/twitter/twitter.app.js')
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
    twitter: {
      type: "app",
      app: "twitter",
      propDefinitions: {
        q: {
          type: "string",
          label: 'Search Term',
          description: "Search for keywords (star wars), screen names (@pipdream), or hashtags (#serverless). You can also use Twitter's standard search operators (https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators).",
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
        q: { propDefinition: [twitter, "q"] },
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
        async search(q, since_id, tweet_mode, count) {   
          const query = querystring.stringify({
            q,
            since_id,
            tweet_mode,
            count,
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
    },
  },
  async run(event) {
    const since_id = this.db.get("since_id") || 0
    const tweet_mode = 'extended'
    const count = this.count
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