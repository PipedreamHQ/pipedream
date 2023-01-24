import base from "../common/base.mjs";

export default {
  ...base,
  key: "drip-custom-event-performed",
  name: "New Custom Event Performed (Instant)",
  description: "Emit new event when a custom event is performed for a subscriber",
  version: "0.0.2",
  dedupe: "unique",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return "subscriber.performed_custom_event";
    },
    getSummary({
      properties: { action },
      subscriber: {
        email, first_name, last_name,
      },
    }) {
      let string = `New Event: ${action} for ${email}`;
      if (first_name) string += ` - ${first_name} ${last_name}`;
      return string;
    },
  },
};
