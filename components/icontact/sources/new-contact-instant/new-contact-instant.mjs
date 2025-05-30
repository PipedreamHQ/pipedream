import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "icontact-new-contact-instant",
  name: "New Contact Created (Instant)",
  description: "Emit new event when a contact is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "contact_created";
    },
    generateMeta({ contact }) {
      return {
        id: contact.contactId,
        summary: `New contact created: ${contact.email}`,
        ts: contact.createDate,
      };
    },
  },
  sampleEmit,
};
