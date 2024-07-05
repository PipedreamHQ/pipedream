import twoChat from "../../2chat.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "2chat-new-whatsapp-order-instant",
  name: "New WhatsApp Order Instant",
  description: "Emit new event when a WhatsApp order is received on user's 2Chat connected number. [See the documentation](https://developers.2chat.co/docs/intro)",
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
    connectedNumber: {
      propDefinition: [
        twoChat,
        "connectedNumber",
      ],
    },
    specificOrder: {
      propDefinition: [
        twoChat,
        "specificOrder",
        (c) => ({
          connectedNumber: c.connectedNumber,
        }),
      ],
      optional: true,
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
  hooks: {
    async deploy() {
      const events = await this.twoChat.emitNewOrderEvent(this.connectedNumber, this.specificOrder);
      for (const event of events) {
        this.$emit(event, {
          id: event.id,
          summary: `New event: ${event.name}`,
          ts: Date.parse(event.ts),
        });
      }
    },
    async activate() {
      const hookId = await this.twoChat.createWebhook({
        connectedNumber: this.connectedNumber,
      });
      this._setWebhookId(hookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.twoChat.deleteWebhook(id);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["X-2Chat-Token"] !== this.twoChat.$auth.api_token) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    this.$emit(body, {
      id: body.id,
      summary: `New order: ${body.orderNumber}`,
      ts: Date.parse(body.createdAt),
    });
  },
};
