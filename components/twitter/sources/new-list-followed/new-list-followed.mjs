import common from "../common/followed.mjs";

export default {
  ...common,
  key: "twitter-new-list-followed",
  name: "New List Followed",
  description: "Emit new event when the authenticated user follows a List",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getFollowed() {
      return this.twitter.getLists({});
    },
    generateMeta(list) {
      return {
        id: list.id,
        summary: list.name,
        ts: Date.now(),
      };
    },
  },
};
