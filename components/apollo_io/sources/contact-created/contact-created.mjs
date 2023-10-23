import common from "../common/polling.mjs";

export default {
  ...common,
  key: "apollo_io-contact-created",
  name: "Contact Created",
  description: "Triggers when a contact is created. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#search-for-contacts)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "contacts";
    },
    getResourceFn() {
      return this.app.searchContacts;
    },
    getResourceFnArgs() {
      return {
        params: {
          sort_by_field: "contact_created_at",
          sort_ascending: false,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Contact: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
