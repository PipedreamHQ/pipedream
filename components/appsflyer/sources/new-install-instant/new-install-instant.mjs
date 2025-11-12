import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "appsflyer-new-install-instant",
  name: "New Install (Instant)",
  description: "Emit new event when a user installs an app tracked by AppsFlyer. [See docs here](https://dev.appsflyer.com/hc/reference/push-api-v2)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "install",
        "organic-install",
      ];
    },
    generateMeta(event) {
      return {
        summary: `New Install ${event.app_id}`,
        id: event.event_id,
        ts: Date.parse(event.event_time),
      };
    },
  },
};
