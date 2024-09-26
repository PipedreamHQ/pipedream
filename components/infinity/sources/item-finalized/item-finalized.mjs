import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  key: "infinity-item-finalized",
  name: "New Item Finalized",
  version: "0.0.1",
  description: "Emit new event when an item is finalized.",
  methods: {
    ...common.methods,
    getMetadata({
      id, created_at,
    }) {
      return {
        id,
        summary: `The item with id: ${id} has been successfully finalized!`,
        ts: Date.parse(created_at),
      };
    },
    getEvent() {
      return [
        "item.finalized",
      ];
    },
  },
};
