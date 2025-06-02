import beekeeper from "../../beekeeper.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "beekeeper-new-chat-message-instant",
  name: "New Chat Message Instant",
  description: "Emit new event instantly when a new chat message is created in any chat the user is a member of. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/1ba495ce70084-register-a-new-webhook)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    beekeeper,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // No historical data fetching required.
    },
    async activate() {
      const webhookResponse = await this.beekeeper._makeRequest({
        method: "POST",
        path: "/api/2/webhooks",
        data: {
          name: "New Chat Message Webhook",
          endpoint_url: this.http.endpoint,
          event_types: [
            "chats.message.created",
            "chats_v2.message.created",
          ],
          secret: this.beekeeper.$auth.webhook_secret,
        },
      });

      this.db.set("webhookId", webhookResponse.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.beekeeper._makeRequest({
          method: "DELETE",
          path: `/api/2/webhooks/${webhookId}`,
        });
      }
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  async run(event) {
    const signature = event.headers["x-beekeeper-signature"];
    const rawBody = event.body_raw;
    const computedSignature = crypto
      .createHmac("sha256", this.beekeeper.$auth.webhook_secret)
      .update(rawBody)
      .digest("base64");

    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.$emit(event.body, {
      id: event.body.id,
      summary: `New message in chat ${event.body.chat_id}`,
      ts: Date.now(),
    });
  },
};
