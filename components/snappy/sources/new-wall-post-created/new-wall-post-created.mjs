import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Wall Post Created",
  version: "0.0.1",
  key: "snappy-new-wall-post-created",
  description: "Emit new event on each wall post created.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New wall post created with ID ${data.id}`,
        ts: data.created_at,
      });
    },
    async getResources(args = {}) {
      return this.snappy.getWallPosts(args);
    },
  },
};
