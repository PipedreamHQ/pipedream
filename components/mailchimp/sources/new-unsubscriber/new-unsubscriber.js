const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "mailchimp-new-unsubscriber",
  name: "New Unsubscriber",
  description:
    "Emit new event when a subscriber is removed from an audience list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "unsubscribe",
      ];
    },
    generateMeta(eventPayload) {
      const ts = +new Date(eventPayload.fired_at);
      return {
        id: `${eventPayload["data[id]"]}`,
        summary: `${eventPayload["data[email]"]} unsubscribed from list ${eventPayload["data[list_id]"]}`,
        ts,
      };
    },
  },
};
