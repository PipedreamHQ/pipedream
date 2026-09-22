import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "getprospect-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created in GetProspect. [See the documentation](https://getprospect.readme.io/reference/contactcontroller_search)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.getprospect.listContacts;
    },
    getParams() {
      return {
        sort: "_id",
        order: "DESC",
      };
    },
    isRelevant(item, lastTs) {
      return !lastTs || Date.parse(item.createdAt) > Date.parse(lastTs);
    },
    generateMeta(item) {
      return {
        id: item._id,
        summary: `New Contact with ID: ${item._id}`,
        ts: Date.parse(item.createdAt),
      };
    },
  },
};
