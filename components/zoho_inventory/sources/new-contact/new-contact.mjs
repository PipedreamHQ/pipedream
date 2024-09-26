import common from "../common/base.mjs";

export default {
  ...common,
  key: "zoho_inventory-new-contact",
  name: "New Contact",
  description: "Emit new event each time a new contact is created in Zoho Inventory",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zohoInventory.listContacts.bind(this);
    },
    getResourceType() {
      return "contacts";
    },
    generateMeta(contact) {
      return {
        id: contact.contact_id,
        summary: `New Contact ${contact.contact_name || contact.contact_id}`,
        ts: Date.parse(contact.created_time),
      };
    },
  },
};
