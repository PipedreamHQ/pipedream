import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "smashsend-new-contact-created",
  name: "New Contact Created (Instant)",
  description: "Emit new event when a contact is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEvents() {
      return [
        "CONTACT_CREATED",
      ];
    },
    getSummary(event) {
      return `New Contact Created: ${event.payload.contact.id}`;
    },
  },
  sampleEmit,
};
