import caspio from "../../caspio.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    caspio,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Meaningful label that identifies the webhook",
    },
    table: {
      propDefinition: [
        caspio,
        "table",
      ],
    },
  },
  hooks: {
    async activate() {
      const { Id: webhookId } = await this.caspio.createWebhook({
        data: {
          Name: this.name,
          OutgoingUrls: [
            this.http.endpoint,
          ],
        },
      });
      this._setWebhookId(webhookId);

      await this.caspio.createWebhookEvent({
        webhookId,
        data: {
          EventType: this.getEventType(),
          ObjectName: this.table,
        },
      });
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (!webhookId) {
        return;
      }
      await this.caspio.deleteWebhook(webhookId);
    },
  },
  methods: {
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    getEventType() {
      throw new ConfigurationError("getEventType is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    if (!body) {
      return;
    }

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
