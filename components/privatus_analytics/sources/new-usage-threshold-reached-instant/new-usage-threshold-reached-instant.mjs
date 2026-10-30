import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-usage-threshold-reached-instant",
  name: "New Usage Threshold Reached (Instant)",
  description: "Emit new event when a usage alert fires because the workspace's monthly events passed a share of the plan's allowance. [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,

  },
  methods: {
    ...common.methods,
    getEvent() {
      return "usage.threshold";
    },
    getSummary(item) {
      return `Usage alert triggered: ${item.name}`;
    },
  },
  sampleEmit,
};
