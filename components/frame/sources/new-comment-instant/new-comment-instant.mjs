import common from "../common/common.mjs";

export default {
  ...common,
  key: "frame-new-comment-instant",
  name: "New Comment (Instant)",
  description: "Emit new event when a new comment is left on an asset. [See the documentation](https://developer.frame.io/api/reference/operation/createWebhookForTeam/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary() {
      return "New Comment";
    },
    getHookData() {
      return [
        "comment.created",
      ];
    },
  },
};
