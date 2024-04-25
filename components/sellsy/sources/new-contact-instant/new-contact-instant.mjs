import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sellsy-new-contact-instant",
  name: "New Contact (Instant)",
  description: "Emit new event whenever a new contact is created in Sellsy",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "people.created";
    },
    getResultItem({ relatedid }) {
      return this.sellsy.getContact({
        contactId: relatedid,
      });
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact with ID: ${contact.id}`,
        ts: Date.parse(contact.created),
      };
    },
  },
  sampleEmit,
};
