import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Unsubscriber (Instant)",
  key: "unisender-new-unsubscriber",
  description: "Emit new event when a email unsubscribes from a list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "unsubscribe";
    },
    getMeta(item) {
      const {
        event_time, email, auth,
      } = item;

      return {
        id: auth + event_time,
        summary: `${email} unsubscribed`,
        ts: new Date(event_time).getTime(),
      };
    },
  },
};
