import common from "../common/base.mjs";

export default {
  ...common,
  key: "smartsheet-new-row-deleted",
  name: "New Row Deleted (Instant)",
  description: "Emit new event when a row is deleted from a sheet.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Pipedream New Row Deleted";
    },
    isRelevant({
      objectType, eventType,
    }) {
      return objectType === "row" && eventType === "deleted";
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `Row ${event.id} deleted`,
        ts: Date.parse(event.timestamp),
      };
    },
    async getResource() {
      // deleted row can't be retrieved, so retrieve sheet resource
      return this.smartsheet.getSheet(this.sheetId);
    },
  },
};
