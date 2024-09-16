import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "firefish-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the documentation](https://developer.firefishsoftware.com/#fcb38fee-8ad7-4aec-b1bd-ba7871e8258c)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.firefish.searchContacts;
    },
    generateMeta(contact) {
      return {
        id: contact.Ref,
        summary: `New Contact ID: ${contact.Ref}`,
        ts: Date.parse(contact.Created),
      };
    },
  },
  sampleEmit,
};
