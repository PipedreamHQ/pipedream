import withings from "../../withings.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "withings-new-measure",
  name: "New Measure",
  description: "Emit new event for each created measure. [See docs here](https://developer.withings.com/api-reference#operation/measure-getmeas)",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    withings,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run() {
    const oneDayInSeconds = 24 * 60 * 60; // hours * minutes * seconds
    const oneDayAgo = Math.round((new Date().getTime() / 1000) - oneDayInSeconds);
    const measures = await this.withings.getMeasures({
      params: {
        lastupdate: oneDayAgo,
      },
    });

    for (const measure of measures) {
      this.$emit(measure, {
        id: measure.grpid,
        summary: `New measure ${measure.grpid}`,
        ts: Date.parse(measure.created),
      });
    }
  },
};
