import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

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
      console.log(`Retrieving at most last ${constants.MAX_HISTORICAL_EVENTS} objects...`);
      const response = await this.square.listCatalogItems({
        paginate: true,
        params: {
          types: "ITEM",
          limit: constants.MAX_LIMIT,
        },
      });
      response?.objects?.slice(-constants.MAX_HISTORICAL_EVENTS)
        .reverse()
        .forEach((object) => this.$emit(object, {
          id: object.id,
          summary: `Catalog item updated: ${object.id}`,
          ts: object.created_at,
        }));
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
