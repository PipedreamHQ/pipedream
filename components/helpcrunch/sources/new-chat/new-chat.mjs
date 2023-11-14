import helpcrunch from "../../helpcrunch.app.mjs";

export default {
  key: "helpcrunch-new-chat",
  name: "New Chat",
  description: "Emit new event when a new chat is created. [See the documentation](https://docs.helpcrunch.com/en/rest-api-v1)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    helpcrunch: {
      type: "app",
      app: "helpcrunch",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Fetch and emit historical chat data
      const chats = await this.helpcrunch.getChats();
      for (const chat of chats) {
        this.$emit(chat, {
          id: chat.id,
          summary: `New chat: ${chat.subject}`,
          ts: Date.parse(chat.createdAt),
        });
      }
    },
    async activate() {
      const webhookId = await this.helpcrunch.createWebhook({
        url: this.http.endpoint,
        events: [
          "chat.created",
        ],
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.helpcrunch.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate the incoming webhook
    if (headers["X-Helpcrunch-Signature"] !== this.helpcrunch.$auth.api_token) {
      this.http.respond({
        status: 401,
      });
      return;
    }

    this.$emit(body, {
      id: body.id,
      summary: `New chat: ${body.subject}`,
      ts: Date.parse(body.createdAt),
    });
  },
};
