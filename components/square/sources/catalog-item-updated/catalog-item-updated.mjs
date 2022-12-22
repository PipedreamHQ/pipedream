import base from "../common/base.mjs";

export default {
  ...base,
  key: "square-catalog-item-updated",
  name: "Catalog Item Updated",
  description: "Emit new event for every updated catalog item",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Retrieving at most last 25...");
    },
  },
  methods: {
    ...base.methods,
    getEventTypes() {
      return [
        "catalog.version.updated",
      ];
    },
    getSummary(event) {
      return `Catalog item updated: ${event.data.id}`;
    },
    getTimestamp(event) {
      return new Date(event.data.object.catalog_version.updated_at);
    },
  },
};
