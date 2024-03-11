import tawkTo from "../../tawk_to.app.mjs";

export default {
  key: "tawk_to-new-chat-started-instant",
  name: "New Chat Started Instant",
  description: "Emits a new event when the first message in a chat is sent by a visitor or agent. [See the documentation](https://docs.tawk.to/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    tawkTo: {
      type: "app",
      app: "tawk_to",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    messageContent: {
      propDefinition: [
        tawkTo,
        "messageContent",
      ],
    },
    senderDetails: {
      propDefinition: [
        tawkTo,
        "senderDetails",
      ],
    },
    timestamp: {
      propDefinition: [
        tawkTo,
        "timestamp",
      ],
    },
  },
  hooks: {
    async activate() {
      const webhookId = this.db.get("webhookId");
      if (!webhookId) {
        const result = await this.tawkTo.createWebhook({
          target_url: this.http.endpoint,
        });
        this.db.set("webhookId", result.data.id);
      }
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.tawkTo.deleteWebhook({
          webhookId,
        });
        this.db.remove("webhookId");
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["content-type"] !== "application/json") {
      return this.http.respond({
        status: 400,
      });
    }

    if (!body || !body.data) {
      return this.http.respond({
        status: 400,
      });
    }

    if (body.data.type !== "chat_started") {
      return this.http.respond({
        status: 200,
      });
    }

    const chat = body.data;
    const message = chat.messages[0];
    if (!message) {
      return this.http.respond({
        status: 200,
      });
    }

    this.$emit({
      id: chat.id,
      summary: `New chat started by ${message.sender.name}`,
      ts: Date.parse(chat.timestamp),
      data: {
        messageContent: message.content,
        senderDetails: message.sender,
        timestamp: chat.timestamp,
      },
    });

    this.http.respond({
      status: 200,
    });
  },
};
