import common from "../common/common.mjs";

export default {
  ...common,
  key: "onedesk-new-user-created",
  name: "New User Created",
  description: "Emit new event when a new user is created. [See the docs](https://www.onedesk.com/developers/#_get_item_updates)",
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
            "User",
          ],
          operations: [
            "CREATE",
          ],
        },
      });
      return data;
    },
    generateMeta(item) {
      return {
        id: item.itemId,
        summary: item.itemName,
        ts: Date.parse(item.collectedTimestamp),
      };
    },
  },
};
