import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "beekeeper-new-comment-created-instant",
  name: "New Comment Created (Instant)",
  description: "Emit new event when a new comment is created. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/1ba495ce70084-register-a-new-webhook)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "POSTS.COMMENT.CREATED";
    },
    getSummary(body) {
      return `New comment on post ${body.payload.comment.postid}`;
    },
  },
  sampleEmit,
};
