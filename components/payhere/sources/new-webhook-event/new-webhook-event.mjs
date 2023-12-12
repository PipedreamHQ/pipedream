import payhere from "../../payhere.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "payhere-new-webhook-event",
  name: "New Webhook Event (Instant)",
  description: "Emit new event for each new webhook event",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    payhere,
    db: "$.service.db",
    http: "$.interface.http",
    integrationName: {
      label: "Integration Name",
      description: "Friendly name of your platform, helps with metrics and debugging",
      type: "string",
    },
    resource: {
      label: "Event Type",
      description: "The event that will be listen",
      type: "string",
      options: constants.WEBHOOK_EVENT_TYPES,
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
  hooks: {
    async activate() {
      const response = await this.payhere.createWebhook({
        integration: this.integrationName,
        post_url: this.http.endpoint,
        resource: this.resource,
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.payhere.removeWebhook(webhookId);
    },
  },
  async run(event) {
    const { body } = event;

    const resourceId = body?.payment?.id ?? body?.subscription?.id;
    const ts = body?.payment?.created_at ?? body?.subscription?.created_at;

    this.$emit(body, {
      id: resourceId,
      summary: `New event ${body.event} with id ${resourceId}`,
      ts: Date.parse(ts),
    });
  },
};
