import common from "../common/base.mjs";

export default {
  ...common,
  key: "suitedash-new-contact",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFn() {
      return this.suitedash.listContacts;
    },
    getSummary(contact) {
      const firstName = contact.first_name || "";
      const lastName = contact.last_name || "";
      const fullName = [
        firstName,
        lastName,
      ].filter(Boolean).join(" ") || "Unknown";
      return `New Contact: ${fullName}`;
    },
  },
};
