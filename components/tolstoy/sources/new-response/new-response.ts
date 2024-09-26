import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  name: "New Response (Instant)",
  version: "0.0.1",
  key: "tolstoy-new-response",
  description: "Emit new event on each new response.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "response_summary";
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.sessionId,
        summary: `New response with id ${data.sessionId}`,
        ts: Date.parse(data.timestamp),
      });
    },
  },
});
