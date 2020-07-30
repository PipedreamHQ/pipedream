const twitter = require('https://github.com/PipedreamHQ/pipedream/components/twitter/twitter.app.js')

module.exports = { 
  name: "Tweet Liked by User",
  description: "Emit new Tweets liked by a specific user on Twitter", 
  version: "0.0.1",
  props: {
    twitter,
    screen_name: { propDefinition: [twitter, "screen_name"] },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  dedupe: "unique",
  async run(event) {     
    (await this.twitter.getLikedTweets({ screen_name: this.screen_name })).reverse().forEach(tweet => {
      this.$emit(tweet, {
        id: tweet.id_str,
        summary: tweet.full_text,
      })
    })
  },
}