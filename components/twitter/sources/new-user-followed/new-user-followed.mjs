import common from "../common/followed.mjs";

export default {
  ...common,
  key: "twitter-new-user-followed",
  name: "New User Followed",
  description: "Emit new event when the authenticated user follows a User",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getFollowed() {
      const { users } = await this.twitter.getUserFollows({});
      return users;
    },
    generateMeta(user) {
      return {
        id: user.id,
        summary: user.name,
        ts: Date.now(),
      };
    },
  },
};
