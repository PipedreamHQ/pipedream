import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "smashsend-contact-unsubscribed",
  name: "Contact Unsubscribed (Instant)",
  description: "Emit new event when a contact is unsubscribed",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEvents() {
      return [
        "CONTACT_UNSUBSCRIBED",
      ];
    },
    getSummary(event) {
      return `Contact Unsubscribed: ${event.payload.contact.id}`;
    },
  },
  sampleEmit,
};
