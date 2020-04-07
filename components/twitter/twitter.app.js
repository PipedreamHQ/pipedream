const axios = require('axios')
const querystring = require("querystring")

module.exports = {
  type: "app",
  app: "twitter",
  propDefinitions: {
    // TODO
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
}