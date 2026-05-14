import surecart from "../../surecart.app.mjs";

export default {
  props: {
    surecart,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "An optional description of what this webhook endpoint is used for",
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.surecart.createWebhook({
        data: {
          webhook_endpoint: {
            description: this.description,
            enabled: true,
            url: this.http.endpoint,
            webhook_events: this.getEvents(),
          },
        },
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (!webhookId) {
        return;
      }
      await this.surecart.deleteWebhook({
        webhookId,
      });
      this._setWebhookId(null);
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New ${body.type} event`,
        ts: (body.created_at || Date.now() / 1000) * 1000,
      };
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
