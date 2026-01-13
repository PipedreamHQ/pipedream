import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "belco-conversation-reopened-instant",
  name: "Conversation Reopened (Instant)",
  description: "Emit new event for each new conversation reopened event",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "conversation.reopened",
      ];
    },
  },
  sampleEmit,
};
