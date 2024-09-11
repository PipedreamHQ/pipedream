import { randomUUID } from "crypto";
import securityReporter from "../../security_reporter.app.mjs";

export default {
  props: {
    securityReporter,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    name: {
      propDefinition: [
        securityReporter,
        "name",
      ],
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.securityReporter.createWebhook({
        data: {
          url: this.http.endpoint,
          name: this.name,
          secret: randomUUID(),
          auth_method: 0,
          types: this.getTypes(),
          mode: 0,
        },
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.securityReporter.deleteWebhook(webhookId);
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
  },
  async run({ body }) {
    const ts = Date.parse(body.model.updated_at);
    this.$emit(body, {
      id: `${body.model.id}-${ts}`,
      summary: this.getSummary(body.model),
      ts,
    });
  },
};
