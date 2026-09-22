import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bugherd-new-comment-instant",
  name: "New Comment (Instant)",
  description: "Emit new event when a new comment is created on a task. [See the documentation](https://www.bugherd.com/api_v2#api_webhook_create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "comment";
    },
    generateMeta(data) {
      const ts = data.comment.created_at;
      const id = data.comment.id;
      return {
        id: `${id}-${ts}`,
        summary: `New comment: ${id}`,
        ts,
      };
    },
  },
  sampleEmit,
};

