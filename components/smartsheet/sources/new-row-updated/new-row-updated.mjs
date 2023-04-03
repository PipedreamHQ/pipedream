import common from "../common/base.mjs";

export default {
  ...common,
  key: "smartsheet-new-row-updated",
  name: "New Row Updated (Instant)",
  description: "Emit new event when a row is upedated in a sheet.",
  version: "0.0.1",
  type: "action",
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
      return {
        id: event.id,
        summary: `Row ${event.id} updated`,
        ts: Date.parse(event.timestamp),
      };
    },
  },
};
