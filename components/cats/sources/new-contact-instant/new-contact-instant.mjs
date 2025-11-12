import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cats-new-contact-instant",
  name: "New Contact Created (Instant)",
  description: "Emit new event when a contact related to a cat is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "contact.created",
      ];
    },
    generateMeta(body) {
      const contact = body._embedded.contact;
      return {
        id: body.contact_id,
        summary: `New contact: ${contact.first_name} ${contact.last_name}`,
        ts: Date.parse(body.date || new Date()),
      };
    },
  },
  sampleEmit,
};
