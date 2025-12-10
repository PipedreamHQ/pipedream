import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "help_scout-conversation-status-updated-instant",
  name: "Conversation Status Updated (Instant)",
  description: "Emit new event when a conversation has its status updated. [See the documentation](https://developer.helpscout.com/webhooks/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "convo.status",
      ];
    },
    getSummary(body) {
      return `Conversation status updated: ${body.subject} (${body.status})`;
    },
  },
  sampleEmit,
};
