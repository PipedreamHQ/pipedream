import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "smashsend-contact-resubscribed",
  name: "Contact Resubscribed (Instant)",
  description: "Emit new event when a contact is resubscribed",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEvents() {
      return [
        "CONTACT_RESUBSCRIBED",
      ];
    },
    getSummary(event) {
      return `Contact Resubscribed: ${event.payload.contact.id}`;
    },
  },
  sampleEmit,
};
