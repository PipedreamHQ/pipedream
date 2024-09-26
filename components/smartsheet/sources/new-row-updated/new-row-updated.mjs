import common from "../common/base.mjs";

export default {
  ...common,
  key: "smartsheet-new-row-updated",
  name: "New Row Updated (Instant)",
  description: "Emit new event when a row is upedated in a sheet.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "Pipedream New Row Updated";
    },
    isRelevant({
      objectType, eventType,
    }) {
      return objectType === "row" && eventType === "updated";
    },
    generateMeta(event) {
      const ts = Date.parse(event.timestamp);
      return {
        id: `${event.id}-${ts}`,
        summary: `Row ${event.id} updated`,
        ts,
      };
    },
    async getResource(event) {
      return this.smartsheet.getRow(this.sheetId, event.id);
    },
  },
};
