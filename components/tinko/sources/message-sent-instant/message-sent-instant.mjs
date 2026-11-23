import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "tinko-message-sent-instant",
  name: "New Message Sent (Instant)",
  description: "Emit new event when a message is sent to a contact from Tinko, by an attendant, an AI agent, an automation or the API. [See the documentation](https://docs.tinko.com.br/webhook/eventos-suportados/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "MESSAGE_SENT",
      ];
    },
    getSummary(data) {
      const content = data.message?.content
        ? `: ${data.message.content.slice(0, 50)}`
        : ` (${data.message?.type ?? "message"})`;
      return `New message sent to ${this.contactLabel(data)}${content}`;
    },
  },
  sampleEmit,
};
