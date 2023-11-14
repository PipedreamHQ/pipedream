import helpcrunch from "../../helpcrunch.app.mjs";

export default {
  key: "helpcrunch-chat-status-updated-instant",
  name: "Chat Status Updated Instant",
  description: "Emit new event when the status of a chat is updated. [See the documentation](https://docs.helpcrunch.com/en/rest-api-v1)",
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
    async activate() {
      // no-op
    },
    async deactivate() {
      // no-op
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["X-Helpcrunch-Signature"] !== this.helpcrunch.$auth.api_token) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    if (body.event === "chat_status_updated") {
      const chat = await this.helpcrunch.getChat(body.data.chat.id);
      this.$emit(chat, {
        id: chat.id,
        summary: `Chat ${chat.id} status updated to ${chat.status}`,
        ts: Date.parse(chat.updatedAt),
      });
    }

    this.http.respond({
      status: 200,
    });
  },
};
