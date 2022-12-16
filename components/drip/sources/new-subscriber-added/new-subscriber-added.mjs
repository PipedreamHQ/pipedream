import base from "../common/base.mjs";

export default {
  ...base,
  key: "drip-new-subscriber-added",
  name: "New Subscriber Added (Instant)",
  description: "Emit new event when a new subscriber is created",
  version: "0.0.2",
  dedupe: "unique",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return "subscriber.created";
    },
    getSummary({
      subscriber: {
        email, first_name, last_name,
      },
    }) {
      let string = `New Subscriber: ${email}`;
      if (first_name) string += ` - ${first_name} ${last_name}`;
      return string;
    },
  },
};
