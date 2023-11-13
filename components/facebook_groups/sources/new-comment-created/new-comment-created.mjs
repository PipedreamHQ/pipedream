import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_groups-new-comment-created",
  name: "New Comment Created",
  description: "Emit new event when a new comment is created on a group post",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    post: {
      propDefinition: [
        common.props.facebookGroups,
        "post",
        (c) => ({
          groupId: c.group,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getTs(comment) {
      return Date.parse(comment.created_time);
    },
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: comment.message,
        ts: this.getTs(comment),
      };
    },
    getArgs() {
      return {
        fn: this.facebookGroups.listPostComments,
        args: {
          postId: this.post,
        },
      };
    },
  },
};
