import messagebird from "../../messagebird.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "messagebird-new-message-received",
  name: "New Message Received (Instant)",
  description: "Emit new event for each new message received. [See the documentation](https://docs.bird.com/api/notifications-api/api-reference/webhook-subscriptions/create-a-webhook-subscription)",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  props: {
    messagebird,
    http: "$.interface.http",
    db: "$.service.db",
    workspaceId: {
      propDefinition: [
        messagebird,
        "workspaceId",
      ],
    },
    platform: {
      type: "string",
      label: "Platform",
      description: "The type of inbound message to watch for",
      options: [
        "sms",
        "whatsapp",
        "email",
        "line",
        "instagram",
        "facebook",
        "viber",
        "linkedin",
        "tiktok",
        "telegram",
      ],
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.messagebird.createWebhook({
        workspaceId: this.workspaceId,
        data: {
          service: "channels",
          event: `${this.platform}.inbound`,
          url: this.http.endpoint,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.messagebird.deleteWebhook({
          workspaceId: this.workspaceId,
          hookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(event) {
      return {
        id: event.payload.id,
        summary: `New Message ID: ${event.payload.id}`,
        ts: Date.parse(event.createdAt),
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
  sampleEmit,
};
