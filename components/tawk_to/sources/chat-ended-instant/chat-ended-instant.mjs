import common from "../common/base.mjs";

export default {
  ...common,
  key: "tawk_to-chat-ended-instant",
  name: "Chat Ended (Instant)",
  description: "Emit new event when a chat ends, usually after 90-150 seconds of inactivity",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "chat:end",
      ];
    },
    generateMeta(event) {
      return {
        id: event.chatId,
        summary: `Chat Ended ${event.chatId}`,
        ts: Date.parse(event.time),
      };
    },
  },
};
