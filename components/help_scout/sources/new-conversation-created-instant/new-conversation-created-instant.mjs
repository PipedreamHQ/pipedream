import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "help_scout-new-conversation-created-instant",
  name: "New Conversation Created (Instant)",
  description: "Emit new event when a new conversation is created.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "convo.created",
      ];
    },
    getSummary(body) {
      return `New conversation created: ${body.subject}`;
    },
  },
  sampleEmit,
};
