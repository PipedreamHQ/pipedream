import dixa from "../../dixa.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dixa-new-message-added-instant",
  name: "New Message Added to Conversation",
  description: "Emit a new event when a new message is added to a conversation. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    name: {
      type: "string",
      label: "Name",
      description: "Name of the event",
    },
    dixa: {
      type: "app",
      app: "dixa",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
  },
  hooks: {
    async deploy() {
      try {
        const messages = await this.dixa.paginate(this.dixa.listMessages, {
          limit: 50,
        });
        for (const message of messages) {
          this.$emit(message, {
            id: message.id,
            summary: `New message in conversation ${message.conversationId}`,
            ts: Date.parse(message.createdAt),
          });
        }
      } catch (error) {
        this.$emit(error, "Error deploying component: " + error.message);
      }
    },
    async activate() {
      try {
        const webhookUrl = this.http.endpoint;
        const webhook = await this.dixa._makeRequest({
          method: "POST",
          path: "/webhooks",
          data: {
            url: webhookUrl,
            events: [
              "conversationmessageadded",
            ],
          },
        });
        await this.db.set("webhookId", webhook.id);
      } catch (error) {
        this.$emit(error, "Error activating webhook: " + error.message);
      }
    },
    async deactivate() {
      try {
        const webhookId = await this.db.get("webhookId");
        if (webhookId) {
          await this.dixa._makeRequest({
            method: "DELETE",
            path: `/webhooks/${webhookId}`,
          });
          await this.db.delete("webhookId");
        }
      } catch (error) {
        this.$emit(error, "Error deactivating webhook: " + error.message);
      }
    },
  },
  async run(event) {
    const message = event.body;
    this.$emit(message, {
      id: message.id,
      summary: `New message in conversation ${message.conversationId}`,
      ts: Date.parse(message.createdAt) || Date.now(),
    });
  },
};
