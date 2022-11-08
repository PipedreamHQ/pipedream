import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-new-trends-by-geo",
  name: "New Trends by Geo",
  description: "Emit new event when a new topic is trending on Twitter in a specific geographic location",
  version: "0.0.8",
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
      description: "Pipedream will poll the Twitter API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
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
