import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Item",
  version: "0.0.1",
  key: "pocket-new-item",
  description: "Emit new event for each added item.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.item_id,
        summary: `New item added with id ${data.item_id}`,
        ts: Date.parse(data.time_added),
      });
    },
  },
};
