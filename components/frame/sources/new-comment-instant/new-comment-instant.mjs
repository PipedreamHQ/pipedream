import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "frame-new-comment-instant",
  name: "New Comment (Instant)",
  description: "Emit new event when a new comment is left on an asset. [See the documentation](https://developer.frame.io/api/reference/operation/createWebhookForTeam/)",
  version: "0.1.0",
  type: "source",
  sampleEmit,
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
    async getResourceData(id) {
      return this.app.getComment(id);
    },
  },
};
