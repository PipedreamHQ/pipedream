const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "mailchimp-new-subscriber",
  name: "New Subscriber",
  description: "Emit new event when a subscriber is added to an audience list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getEventName() {
      return [
        "subscribe",
      ];
    },
    getEventType() {
      return [
        "subscribe",
      ];
    },
    generateMeta(eventPayload) {
      const ts = +new Date(eventPayload.fired_at);
      return {
        id: `${eventPayload["data[id]"]}`,
        summary: `${eventPayload["data[email]"]} subscribed to list ${eventPayload["data[list_id]"]}`,
        ts,
      };
    },
  },
};
