const _ = require('lodash')
const axios = require('axios')

module.exports = {
  name: "github-search",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      intervalSeconds: 60,
    },
    github: {
      type: "app",
      app: "github",
    },
    q: "string",
    sort: "string",
  },
  async run(events) {
    //See the API docs here: https://developer.github.com/v3/search/#search-issues-and-pull-requests
    const config = {
      url: `https://api.github.com/search/issues`,
      params: {
        q: this.q,
        sort: this.sort,
      },
      headers: {
        Authorization: `Bearer ${this.github.$auth.oauth_access_token}`,
      },
    }
    const response = await require("@pipedreamhq/platform").axios(this, config)
    console.log(response)

    /*
    response.statuses.forEach(tweet => {
      if (tweet.in_reply_to_status_id === null && tweet.retweet_count === 0) {
        if (_.get(tweet,'retweeted_status','') === '') {
          this.$emit(tweet)
        }
        if (tweet.id > maxId) {
          maxId = tweet.id
        }
      }
    })
    */
  },
}