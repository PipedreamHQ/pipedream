import common from "../common/polling.mjs";

export default {
  ...common,
  key: "freshdesk-contact-updated",
  name: "Contact Updated",
  description: "Emit new event when a contact is updated. [See the documentation](https://developers.freshdesk.com/api/#filter_contacts)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.freshdesk.filterContacts;
    },
    getTsField() {
      return "updated_at";
    },
    generateMeta(item) {
      const ts = Date.parse(item.updated_at);
      return {
        id: `${item.id}-${ts}`,
        summary: `Contact Updated (ID: ${item.id})`,
        ts,
      };
    },
  },
};
