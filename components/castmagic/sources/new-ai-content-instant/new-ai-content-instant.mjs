import castmagic from "../../castmagic.app.mjs";

export default {
  key: "castmagic-new-ai-content-instant",
  name: "New AI Content Instant",
  description: "Emit new event when an AI content is manually pushed to the integration by the user in the app. [See the documentation](https://docs.castmagic.io/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    castmagic,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    aiContentIdentification: {
      propDefinition: [
        castmagic,
        "aiContentIdentification",
      ],
    },
  },
  hooks: {
    async activate() {
      const webhookSubscription = await this.castmagic.createWebhook({
        targetUrl: this.http.endpoint,
        events: [
          "ai_content",
        ],
      });
      this.db.set("webhookSubscriptionId", webhookSubscription.id);
    },
    async deactivate() {
      const webhookSubscriptionId = this.db.get("webhookSubscriptionId");
      await this.castmagic.deleteWebhook(webhookSubscriptionId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["x-castmagic-signature"] !== this.castmagic.$auth.api_secret) {
      return this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
    }
    if (body.aiContentIdentification !== this.aiContentIdentification) {
      return;
    }
    this.$emit(body, {
      id: body.id,
      summary: `New AI Content: ${body.name}`,
      ts: Date.now(),
    });
  },
};
