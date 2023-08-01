import common from "../common/base.mjs";

export default {
  ...common,
  key: "zoho_sprints-new-item-updated",
  name: "New Item Updated (Instant)",
  description: "Emit new event when an existing item in Zoho Sprints is modified.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getModule() {
      return "3"; // 3 = Item
    },
    getEventType() {
      return "item_update";
    },
    generateMeta() {
      return {
        id: Date.now(),
        summary: "Item Updated",
        ts: Date.now(),
      };
    },
  },
};
