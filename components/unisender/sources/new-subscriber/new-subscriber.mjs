import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Subscriber (Instant)",
  key: "unisender-new-subscriber",
  description: "Emit new event when a new subscription is created.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "subscribe";
    },
    getMeta(item) {
      const {
        event_time, email, auth,
      } = item;

      return {
        id: auth + event_time,
        summary: `${email} is a new subscriber`,
        ts: new Date(event_time).getTime(),
      };
    },
  },
};
