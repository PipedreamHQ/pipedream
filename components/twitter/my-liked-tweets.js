const twitter = require('https://github.com/PipedreamHQ/pipedream/components/twitter/twitter.app.js')

module.exports = { 
  name: "My Liked Tweets", 
  description: "Emit new Tweets you like on Twitter", 
  version: "0.0.1",
  props: {
    twitter,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  dedupe: "unique",
  async run(event) {     
    (await this.twitter.getLikedTweets()).reverse().forEach(tweet => {
      this.$emit(tweet, {
        id: tweet.id_str,
        summary: tweet.full_text,
      })
    })
  },
}