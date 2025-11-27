import common from "../common/polling.mjs";

export default {
  ...common,
  key: "freshdesk-new-contact",
  name: "New Contact Created",
  description: "Emit new event when a contact is created. [See the documentation](https://developers.freshdesk.com/api/#filter_contacts)",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.freshdesk.filterContacts;
    },
    getTsField() {
      return "created_at";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Contact: "${item.name}"`,
        ts: Date.parse(item.created_at),
      };
    },
  },
};
