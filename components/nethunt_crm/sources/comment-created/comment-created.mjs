import base from "../common/polling.mjs";

export default {
  ...base,
  key: "nethunt_crm-comment-created",
  name: "New Comment Created",
  description: "Emit new event for every created comment. [See docs here](https://nethunt.com/integration-api#new-comment)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    async fetchData(opts) {
      return this.nethuntCrm.listRecentlyCreatedCommentsInFolder(opts);
    },
    emitEvents(data) {
      for (const comment of data) {
        this.$emit(comment, {
          id: comment.id,
          summary: `New comment: ${comment.text}`,
          ts: comment.createdAt,
        });
      }
    },
  },
};
