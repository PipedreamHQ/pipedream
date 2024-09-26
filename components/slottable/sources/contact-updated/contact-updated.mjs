import common from "../common/base.mjs";

export default {
  ...common,
  key: "slottable-contact-updated",
  name: "Contact Updated",
  version: "0.0.1",
  description: "Emit new event when a contact is changed (new, updated, or deleted) in Slottable.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getModel() {
      return "Contact";
    },
    generateMeta(contact) {
      const ts = Date.parse(contact.updated_at);
      return {
        id: `${contact.id}-${ts}`,
        summary: `Contact Updated with ID ${contact.id}`,
        ts,
      };
    },
  },
};
