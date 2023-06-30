import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  key: "infinity-item-created",
  name: "New Item Created",
  version: "0.0.1",
  description: "Emit new event when an item is created.",
  methods: {
    ...common.methods,
    getMetadata({
      id, created_at,
    }) {
      return {
        id,
        summary: `The item with id: ${id} has been successfully created!`,
        ts: Date.parse(created_at),
      };
    },
    getEvent() {
      return [
        "item.created",
      ];
    },
  },
};
