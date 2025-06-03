import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "icontact-contact-subscribed-instant",
  name: "New Contact Subscribed (Instant)",
  description: "Emit new event when a contact is subscribed to a list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "contact_subscribed";
    },
    generateMeta({
      contact, list,
    }) {
      return {
        id: `${contact.contactId}-${list.listId}`,
        summary: `Contact "${contact.email}" subscribed to list "${list.name}"`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
