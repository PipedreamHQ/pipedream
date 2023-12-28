import base from "../common/base-polling.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "square-catalog-item-updated",
  name: "Catalog Item Updated",
  description: "Emit new event every time a catalog item is updated. [See the docs](https://developer.squareup.com/reference/square/catalog-api/list-catalog)",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log(`Retrieving at most last ${constants.MAX_HISTORICAL_EVENTS} objects...`);
      const { objects } = await this.square.listCatalogItems({
        params: {
          ...this.getBaseParams(),
        },
      });
      if (!(objects?.length > 0)) {
        return;
      }

      let newLastTs = 0;
      for (const object of objects.slice(0, constants.MAX_HISTORICAL_EVENTS)) {
        if (Date.parse(object.updated_at) > newLastTs) {
          newLastTs = Date.parse(object.updated_at);
        }
        this.$emit(object, this.generateMeta(object));
      }
      this._setLastTs(newLastTs);
    },
  },
  methods: {
    ...base.methods,
    getBaseParams() {
      return {
        limit: constants.MAX_LIMIT,
        types: "ITEM",
      };
    },
    generateMeta(object) {
      const ts = Date.parse(object.updated_at);
      return {
        id: `${object.id}${ts}`,
        summary: `Catalog Item Updated: ${object.id}`,
        ts,
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let newLastTs = lastTs;
    let cursor;

    do {
      const response = await this.square.listCatalogItems({
        params: {
          ...this.getBaseParams(),
          cursor,
        },
      });
      const { objects } = response;
      if (!(objects?.length > 0)) {
        break;
      }
      for (const object of objects) {
        if (Date.parse(object.updated_at) > lastTs) {
          newLastTs = Date.parse(object.updated_at);
        }
        this.emitEvent(object);
      }
      cursor = response?.cursor;
    } while (cursor);

    this._setLastTs(newLastTs);
  },
};
