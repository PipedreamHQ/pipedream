import common from "../common/base.mjs";

export default {
  ...common,
  key: "agile_crm-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.agileCrm.listContacts.bind(this);
    },
    generateMeta(contact) {
      const firstName = (contact.properties.find((prop) => prop.name === "first_name"))?.value || contact.id;
      const lastName = (contact.properties.find((prop) => prop.name === "last_name"))?.value || "";
      return {
        id: contact.id,
        summary: `${firstName} ${lastName}`,
        ts: contact.created_time,
      };
    },
  },
};
