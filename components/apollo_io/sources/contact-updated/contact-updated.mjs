import common from "../common/polling.mjs";

export default {
  ...common,
  key: "apollo_io-contact-updated",
  name: "Contact Updated",
  description: "Emit new event when a contact is updated. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#search-for-contacts)",
  type: "source",
  version: "0.0.9",
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
        debug: true,
        params: {
          sort_by_field: "contact_updated_at",
          sort_ascending: false,
        },
      };
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Contact Updated: ${resource.name}`,
        ts,
      };
    },
  },
};
