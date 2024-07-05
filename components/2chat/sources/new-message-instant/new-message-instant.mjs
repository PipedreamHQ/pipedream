import { axios } from "@pipedream/platform";
import twoChat from "../../2chat.app.mjs";

export default {
  key: "2chat-new-message-instant",
  name: "New Message Instant",
  description: "Emit new event when a new message is either sent or received on 2Chat. [See the documentation](https://developers.2chat.co/docs/intro)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    twoChat: {
      type: "app",
      app: "2chat",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    account: {
      propDefinition: [
        twoChat,
        "account",
      ],
    },
  },
  hooks: {
    async activate() {
      const opts = {
        account: this.account,
      };
      const response = await this.twoChat.emitNewMessageEvent(opts);
      this.db.set("lastMessageId", response.data.id);
    },
    async deactivate() {
      await this.twoChat.deleteWebhook(this.db.get("webhookId"));
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["X-2Chat-Signature"] !== this.twoChat.$auth.api_token) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const lastMessageId = this.db.get("lastMessageId");

    if (body.id && body.id !== lastMessageId) {
      this.$emit(body, {
        id: body.id,
        summary: `New message from ${body.from}: ${body.text}`,
        ts: Date.parse(body.createdAt),
      });
      this.db.set("lastMessageId", body.id);
    }
  },
};
