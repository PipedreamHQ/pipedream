import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Tagged item",
  version: "0.0.1",
  key: "pocket-new-tagged-item",
  description: "Emit new event for each tagged item.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    tag: {
      label: "Tag",
      description: "The tag to search and filter items",
      type: "string",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    additionalParams() {
      return {
        tag: this.tag,
      };
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.item_id,
        summary: `New item tagged with id ${data.item_id}`,
        ts: Date.parse(data.time_favorited),
      });
    },
  },
};
