const twitter = require('https://github.com/PipedreamHQ/pipedream/components/twitter/twitter.app.js')

module.exports = { 
  name: "new-trends-by-geo", 
  version: "0.0.1",
  props: {
    twitter,
    trendLocation: { propDefinition: [twitter, "trendLocation"] },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  dedupe: "unique",
  async run(event) {     
    const response = (await this.twitter.getTrends()).forEach(geo => {
      geo.trends.reverse().forEach(trend => {
        this.$emit(trend, {
          id: trend.query,
          summary: trend.name,
        })
      })
    })
  },
}