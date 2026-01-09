import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "belco-conversation-replied-instant",
  name: "Conversation Replied (Instant)",
  description: "Emit new event for each new conversation replied event",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "conversation.replied",
      ];
    },
  },
  sampleEmit,
};
