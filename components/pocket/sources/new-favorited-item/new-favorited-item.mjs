import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Favorited item",
  version: "0.0.1",
  key: "pocket-new-favorited-item",
  description: "Emit new event for each favorited item.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    additionalParams() {
      return {
        favorite: 1,
      };
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.item_id,
        summary: `New item favorited with id ${data.item_id}`,
        ts: Date.parse(data.time_favorited),
      });
    },
  },
};
