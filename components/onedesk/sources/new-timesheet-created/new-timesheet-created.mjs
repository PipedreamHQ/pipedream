import common from "../common/common.mjs";

export default {
  ...common,
  key: "onedesk-new-timesheet-created",
  name: "New Timesheet Created",
  description: "Emit new event when a new timesheet is created. [See the docs](https://www.onedesk.com/developers/#_get_item_updates)",
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
            "ProjectTaskTimesheet",
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
        summary: `New Timesheet ID ${item.itemId}`,
        ts: Date.parse(item.collectedTimestamp),
      };
    },
  },
};
