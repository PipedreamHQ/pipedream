import common from "../common/common.mjs";

export default {
  ...common,
  key: "onedesk-new-item-updated",
  name: "New Item Updated",
  description: "Emit new event when an item is updated. [See the docs](https://www.onedesk.com/developers/#_get_item_updates)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getUpdates(applicationId) {
      const { data } = await this.onedesk.getItemUpdates({
        data: {
          applicationId,
          itemTypes: [
            "ProjectTask",
          ],
          operations: [
            "PROPERTY_UPDATE",
          ],
        },
      });
      return data;
    },
    generateMeta(item) {
      return {
        id: item.itemId,
        summary: item.itemName || `New Item ID ${item.itemId}`,
        ts: Date.parse(item.collectedTimestamp),
      };
    },
  },
};
