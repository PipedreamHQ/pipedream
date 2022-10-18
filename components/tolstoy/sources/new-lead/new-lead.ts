import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  name: "New Lead (Instant)",
  version: "0.0.1",
  key: "tolstoy-new-lead",
  description: "Emit new event on each new lead.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "conversion";
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.sessionId,
        summary: `New lead with id ${data.sessionId}`,
        ts: Date.parse(data.timestamp),
      });
    },
  },
});
