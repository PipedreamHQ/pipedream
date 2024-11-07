import heroku from "../../heroku.app.mjs";

export default {
  key: "heroku-new-webhook-event-instant",
  name: "New Webhook Event Instant",
  description: "Emit new event on each webhook event. [See the documentation](https://devcenter.heroku.com/categories/platform-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    heroku,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    appId: {
      propDefinition: [
        heroku,
        "appId",
      ],
    },
    entity: {
      propDefinition: [
        heroku,
        "entity",
      ],
    },
    eventTypes: {
      propDefinition: [
        heroku,
        "eventTypes",
      ],
    },
  },
  hooks: {
    async activate() {
      const webhookId = await this.heroku.createWebhookSubscription(
        this.appId,
        this.entity,
        this.eventTypes,
      );
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.heroku.deleteWebhookSubscription(webhookId);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate the incoming webhook payload
    if (headers["heroku-webhook-hmac-sha256"] !== this.heroku.$auth.webhook_secret) {
      console.log("Invalid signature");
      return;
    }

    // Emit the event
    this.$emit(body, {
      id: body.id,
      summary: `New event: ${body.event_type}`,
      ts: Date.parse(body.created_at),
    });
  },
};
