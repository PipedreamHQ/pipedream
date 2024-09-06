import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "krispcall-new-contact-instant",
  name: "New Contact (Instant)",
  description: "Emit new event when a new contact is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getAction() {
      return "new_contact";
    },
    getSummary(body) {
      return `New contact created: ${body.name} ${body.contact_number}`;
    },
  },
  sampleEmit,
};
