import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "appsflyer-new-in-app-event-instant",
  name: "New In-App Event (Instant)",
  description: "Emit new event when an in-app event is recorded, such as a purchase or level completion. [See docs here](https://dev.appsflyer.com/hc/reference/push-api-v2)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "install-in-app-event",
        "organic-install-in-app-event",
        "re-engagement-in-app-event",
        "re-attribution-in-app-event",
      ];
    },
    generateMeta(event) {
      return {
        summary: `New In-App Event ${event.event_name}`,
        id: event.event_id,
        ts: Date.parse(event.event_time),
      };
    },
  },
};
