import common from "../common/base.mjs";

export default {
  ...common,
  key: "smartsheet-new-row-added",
  name: "New Row Added (Instant)",
  description: "Emit new event when a row is added to a sheet.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Pipedream New Row Added";
    },
    isRelevant({
      objectType, eventType,
    }) {
      return objectType === "row" && eventType === "created";
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `Row ${event.id} added`,
        ts: Date.parse(event.timestamp),
      };
    },
    async getResource(event) {
      return this.smartsheet.getRow(this.sheetId, event.id);
    },
  },
};
