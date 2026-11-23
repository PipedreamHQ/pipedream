import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "tinko-chat-transferred-instant",
  name: "New Chat Transferred (Instant)",
  description: "Emit new event when a chat is transferred to another channel or attendant in Tinko. [See the documentation](https://docs.tinko.com.br/webhook/eventos-suportados/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "CHAT_TRANSFERRED",
      ];
    },
    getSummary(data) {
      const target = data.to_user?.name || data.to_channel?.name;
      return target
        ? `Chat with ${this.contactLabel(data)} transferred to ${target}`
        : `Chat with ${this.contactLabel(data)} transferred`;
    },
  },
  sampleEmit,
};
