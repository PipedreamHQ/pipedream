import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_groups-new-comment-created",
  name: "New Comment Created",
  description: "Emit new event when a new comment is created on a group post",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    post: {
      propDefinition: [
        common.props.facebookGroups,
        "post",
        (c) => ({
          group: c.group,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: comment.message,
        ts: comment.created_time,
      };
    },
    getArgs() {
      return {
        fn: this.facebookGroups.listComments,
        args: {
          postId: this.post,
        },
      };
    },
  },
};
