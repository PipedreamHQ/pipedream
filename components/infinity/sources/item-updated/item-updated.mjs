import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  key: "infinity-item-updated",
  name: "New Item Updated",
  version: "0.0.1",
  description: "Emit new event when an item is updated.",
  methods: {
    ...common.methods,
    getMetadata({
      id, created_at,
    }) {
      return {
        id,
        summary: `The item with id: ${id} has been successfully updated!`,
        ts: Date.parse(created_at),
      };
    },
    getEvent() {
      return [
        "item.updated",
      ];
    },
  },
};
