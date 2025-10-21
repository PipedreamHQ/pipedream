import fathom from "../../fathom.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    fathom,
    db: "$.service.db",
    http: "$.interface.http",
    include: {
      type: "string[]",
      label: "Include Fields",
      description: "Fields to include in the webhook payload",
      options: [
        "action_items",
        "crm_matches",
        "summary",
        "transcript",
      ],
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.fathom.createWebhook({
        data: {
          destination_url: this.http.endpoint,
          ...this.getWebhookData(),
        },
      });

      this._setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.fathom.deleteWebhook({
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
    getWebhookData() {
      throw new ConfigurationError("getWebhookData is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
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
