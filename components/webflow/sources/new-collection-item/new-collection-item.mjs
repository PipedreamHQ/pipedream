import common from "../common/collection-common.mjs";
import constants from "../../common/constants.mjs";

export default {
  type: "source",
  key: "webflow-new-collection-item",
  name: "New Collection Item",
  description: "Emit new event when a collection item is created. [See the docs here](https://developers.webflow.com/#item-model)",
  version: "0.2.0",
  ...common,
  hooks: {
    ...common.hooks,
    async deploy() {
      if (this.collectionIds?.length !== 1) {
        console.log("Skipping retrieval of historical events for multiple or no Collection ID");
        return;
      }

      const path = `/collections/${this.collectionIds[0]}/items`;
      console.log("Retrieving historical events...");

      let {
        total,
        items: events,
      } = await this._makeRequest(path);

      if (total > constants.LIMIT) {
        const offset = Math.floor(total / constants.LIMIT);

        events = (await this._makeRequest(path, {
          offset,
        })).items.reverse();

        events.push(...(await this._makeRequest(path, {
          offset: offset - 1,
        })).items.reverse());
      } else {
        events.reverse();
      }

      this.emitHistoricalEvents(events);
    },
  },
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "collection_item_created";
    },
    generateMeta(data) {
      return {
        id: data._id,
        summary: `New collection item ${data.slug} created`,
        ts: Date.parse(data["created-on"]),
      };
    },
  },
};
