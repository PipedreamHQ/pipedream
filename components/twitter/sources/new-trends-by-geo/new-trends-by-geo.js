const twitter = require("../../twitter.app.js");

module.exports = {
  key: "twitter-new-trends-by-geo",
  name: "New Trends by Geo",
  description: "Emit new events when topics are trending on Twitter in a specific geographic location",
  version: "0.0.5",
  type: "source",
  props: {
    twitter,
    trendLocation: {
      propDefinition: [
        twitter,
        "trendLocation",
      ],
    },
    timer: {
      label: "Polling interval",
      description: "How often to poll the Twitter API for new trending topics",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  dedupe: "unique",
  async run() {
    (await this.twitter.getTrends({
      id: this.trendLocation,
    })).forEach((geo) => {
      geo.trends.reverse().forEach((trend) => {
        this.$emit(trend, {
          id: trend.query,
          summary: trend.name,
        });
      });
    });
  },
};
