import common from "../common/common.mjs";

export default {
  ...common,
  key: "salesflare-new-contact",
  name: "New Contact Event",
  description: "Emit new events when new contacts are created. [See the docs](https://api.salesflare.com/docs#operation/getContacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getContacts;
    },
    getSummary(item) {
      return `New contact ${item.name} (ID: ${item.id})`;
    },
  },
};
