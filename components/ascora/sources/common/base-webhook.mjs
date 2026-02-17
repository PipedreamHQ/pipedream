import ascora from "../../ascora.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    ascora,
    db: "$.service.db",
    http: "$.interface.http",
    name: {
      type: "string",
      label: "Webhook Name",
      description: "The name of the webhook",
    },
  },
  hooks: {
    async activate() {
      const { subscriptionId } = await this.ascora.createWebhook({
        data: {
          hookUrl: this.http.endpoint,
          systemName: this.name,
          hookEvent: this.getEventType(),
        },
      });
      this._setWebhookId(subscriptionId);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.ascora.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getEventType() {
      throw new ConfigurationError("getEventType() must be implemented");
    },
  },
  async run({ body }) {
    if (!body) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
