import zohoDesk from "../../zoho_desk.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    zohoDesk,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    infoAlert: {
      type: "alert",
      alertType: "info",
      content: "Webhooks are available for Professional and Enterprise plans only",
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.zohoDesk.createWebhook({
        data: {
          url: this.http.endpoint,
          subscriptions: this.getSubscriptions(),
        },
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.zohoDesk.deleteWebhook({
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
    getSubscriptions() {
      throw new ConfigurationError("getSubscriptions is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body: events } = event;

    if (!events || !Array.isArray(events)) {
      return;
    }

    for (const event of events) {
      const { payload } = event;
      const meta = this.generateMeta(payload);
      this.$emit(payload, meta);
    }
  },
};
