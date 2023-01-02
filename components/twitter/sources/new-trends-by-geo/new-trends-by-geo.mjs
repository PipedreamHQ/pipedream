import twitter from "../../twitter.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "twitter-new-trends-by-geo",
  name: "New Trends by Geo",
  description: "Emit new event when a new topic is trending on Twitter in a specific geographic location",
  version: "0.0.10",
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
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
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
