import common from "../common/base.mjs";

export default {
  ...common,
  key: "tawk_to-new-chat-started-instant",
  name: "New Chat Started (Instant)",
  description: "Emit new event when the first message in a chat is sent by a visitor or agent.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "chat:start",
      ];
    },
    generateMeta(event) {
      return {
        id: event.chatId,
        summary: `New Chat Started ${event.chatId}`,
        ts: Date.parse(event.time),
      };
    },
  },
};
