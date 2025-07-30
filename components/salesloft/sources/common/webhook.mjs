import { v4 as uuid } from "uuid";
import salesloft from "../../salesloft.app.mjs";

export default {
  props: {
    salesloft,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    generateMeta(data) {
      const { id } = data;
      return {
        id: id || uuid(),
        summary: this.getSummary(data),
        ts: Date.now(),
      };
    },
  },
  hooks: {
    async activate() {
      const response = await this.salesloft.createWebhookSubscription({
        data: {
          callback_url: this.http.endpoint,
          callback_token: `pd_${Date.now()}`,
          event_type: this.getEventType(),
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.salesloft.deleteWebhookSubscription(webhookId);
      }
    },
  },
  async run(event) {
    const { body } = event;
    if (body.id) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    }
  },
};
