import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_groups-new-post-created",
  name: "New Post Created",
  description: "Emit new event when a new post is created in a group",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTs(post) {
      return Date.parse(post.updated_time);
    },
    generateMeta(post) {
      return {
        id: post.id,
        summary: post.message,
        ts: this.getTs(post),
      };
    },
    getArgs() {
      return {
        fn: this.facebookGroups.listPosts,
        args: {
          groupId: this.group,
        },
      };
    },
  },
};
