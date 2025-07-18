import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "smashsend-contact-updated",
  name: "Contact Updated (Instant)",
  description: "Emit new event when a contact is updated",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEvents() {
      return [
        "CONTACT_UPDATED",
      ];
    },
    getSummary(event) {
      return `Contact Updated: ${event.payload.contact.id}`;
    },
  },
  sampleEmit,
};
