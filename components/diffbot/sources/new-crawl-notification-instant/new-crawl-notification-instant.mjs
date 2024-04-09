import diffbot from "../../diffbot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diffbot-new-crawl-notification-instant",
  name: "New Crawl Notification Instant",
  description: "Emits a new event when a Diffbot Crawlbot crawl is completed. [See the documentation](https://docs.diffbot.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    diffbot: {
      type: "app",
      app: "diffbot",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    webhookUrl: {
      propDefinition: [
        diffbot,
        "webhookUrl",
      ],
    },
  },
  hooks: {
    async deploy() {
      // No historical event fetching is necessary for this component
    },
    async activate() {
      const { data } = await this.diffbot.emitCrawlbotCompletionEvent({
        webhookUrl: this.webhookUrl,
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.diffbot.deleteWebhook({
          id: webhookId,
        });
      }
    },
  },
  async run(event) {
    const { body } = event;
    const { headers } = event;

    // Assuming the Diffbot app has a method to verify the webhook signature
    const signatureIsValid = this.diffbot.verifyWebhookSignature({
      headers,
      body,
    });
    if (!signatureIsValid) {
      this.http.respond({
        status: 401,
        body: "Invalid signature",
      });
      return;
    }

    this.$emit(body, {
      id: body.id || `${Date.now()}`, // Use provided id or timestamp if id not present
      summary: "Crawlbot crawl completed",
      ts: body.timestamp
        ? Date.parse(body.timestamp)
        : Date.now(), // Use provided timestamp or current time
    });

    // Respond to the HTTP request to acknowledge receipt
    this.http.respond({
      status: 200,
      body: "Webhook received",
    });
  },
};
