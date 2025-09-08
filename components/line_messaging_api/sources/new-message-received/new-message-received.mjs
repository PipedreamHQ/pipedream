import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "line_messaging_api-new-message-received",
  name: "New Message Received (Instant)",
  description: "Emit new event for every received message in a channel",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(event) {
      return {
        id: event.message.id,
        summary: event.message.text,
        ts: event.timestamp,
      };
    },
  },
  async run({ body }) {
    if (!body?.events) {
      return;
    }
    body.events.forEach((event) => {
      if (event.type === "message") {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      }
    });
  },
  sampleEmit,
};
