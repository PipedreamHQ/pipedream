import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Archived item",
  version: "0.0.2",
  key: "pocket-new-archived-item",
  description: "Emit new event for each archived item.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    additionalParams() {
      return {
        state: "archive",
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
