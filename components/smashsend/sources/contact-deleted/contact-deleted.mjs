import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "smashsend-contact-deleted",
  name: "Contact Deleted (Instant)",
  description: "Emit new event when a contact is deleted",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEvents() {
      return [
        "CONTACT_DELETED",
      ];
    },
    getSummary(event) {
      return `Contact Deleted: ${event.payload.contact.id}`;
    },
  },
  sampleEmit,
};
