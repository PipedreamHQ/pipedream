import dixa from "../../dixa.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "dixa-new-conversation-created-instant",
  name: "New Conversation Created",
  description: "Emit new event when a conversation is created in Dixa. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dixa: {
      type: "app",
      app: "dixa",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    name: {
      propDefinition: [
        "dixa",
        "name",
      ],
    },
  },
  hooks: {
    async deploy() {
      const conversations = await this.dixa.listConversations();
      const latestConversations = conversations.slice(-50).reverse();
      for (const conversation of latestConversations) {
        this.$emit(conversation, {
          id: conversation.id,
          summary: `New conversation created: ${this.name}`,
          ts: new Date(conversation.created_at).getTime(),
        });
      }
    },
    async activate() {
      const endpoint = this.http.endpoint;
      const webhookData = {
        event: "conversation.created",
        callback_url: endpoint,
      };
      const response = await this.dixa._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: webhookData,
      });
      const webhookId = response.id;
      await this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.dixa._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const signature = event.headers["X-Dixa-Signature"];
    const secret = this.dixa.$auth.api_token;
    const rawBody = JSON.stringify(event.body);
    const computedSignature = crypto.createHmac("sha256", secret).update(rawBody)
      .digest("hex");

    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const conversation = event.body;
    this.$emit(conversation, {
      id: conversation.id,
      summary: `New conversation created: ${this.name}`,
      ts: new Date(conversation.created_at).getTime(),
    });
  },
};
