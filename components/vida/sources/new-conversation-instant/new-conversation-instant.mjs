import vida from "../../vida.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vida-new-conversation-instant",
  name: "New Conversation Instant",
  description: "Emit new events after completion of any communication handled by your Vida AI agent, be it a call, text, or email. [See the documentation](https://vida.io/docs/api-reference/webhooks/add-webhook)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vida,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // No historical data to fetch
    },
    async activate() {
      const webhookId = await this.vida._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          url: this.http.endpoint,
          label: "Pipedream Webhook",
          type: "conversation",
        },
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.vida._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
  async run(event) {
    console.log("Emitting event...");
    this.$emit(event.body, {
      id: event.body.id || event.body.timestamp || new Date().toISOString(),
      summary: `New communication event: ${event.body.type}`,
      ts: Date.parse(event.body.timestamp) || Date.now(),
    });
  },
};
