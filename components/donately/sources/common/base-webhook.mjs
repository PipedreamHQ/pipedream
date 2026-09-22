import donately from "../../donately.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    donately,
    db: "$.service.db",
    http: "$.interface.http",
    accountId: {
      propDefinition: [
        donately,
        "accountId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the webhook.",
      optional: true,
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
      throw new ConfigurationError("getEventType must be implemented");
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New ${event.type_string} event received`,
        ts: event.created,
      };
    },
  },
  hooks: {
    async activate() {
      const response = await this.donately.createWebhook({
        data: {
          account_id: this.accountId,
          post_url: this.http.endpoint,
          hook: this.getEventType(),
          title: this.title,
        },
      });
      this._setWebhookId(response?.data?.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.donately.deleteWebhook({
          hookId: webhookId,
        });
      }
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
};
