import common from "../common/polling.mjs";

export default {
  ...common,
  key: "holded-contact-created",
  name: "New Contact Created",
  description: "Emit new event when an existing contact is created in Holded. [See the docs](https://developers.holded.com/reference/list-contacts-1).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listContacts;
    },
    getOrderFn() {
      return (a, b) => a.createdAt - b.createdAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Contact: ${resource.name}`,
        ts: resource.createdAt,
      };
    },
  },
};
