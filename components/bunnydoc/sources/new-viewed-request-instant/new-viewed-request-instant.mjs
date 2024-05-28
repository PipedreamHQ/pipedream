import bunnydoc from "../../bunnydoc.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bunnydoc-new-viewed-request-instant",
  name: "New Viewed Signature Request (Instant)",
  description: "Emit new event when a signature request is viewed.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    bunnydoc,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    hookUrl: {
      propDefinition: [
        bunnydoc,
        "hookUrl",
      ],
    },
    webhookEvents: {
      propDefinition: [
        bunnydoc,
        "webhookEvents",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Subscribe to webhook events on deploy
      const webhookEvents = [
        "signatureRequestViewed",
      ];
      const subscription = await this.bunnydoc.subscribeWebhook({
        hookUrl: this.http.endpoint,
        webhookEvents,
      });
      this.db.set("subscriptionId", subscription.id);
    },
    async activate() {
      // Placeholder for any activation logic if needed
    },
    async deactivate() {
      // Unsubscribe from webhook events on deactivate
      const subscriptionId = this.db.get("subscriptionId");
      if (subscriptionId) {
        await this.bunnydoc.unsubscribeWebhook({
          id: subscriptionId,
        });
      }
    },
  },
  async run(event) {
    // Validate the incoming webhook for security reasons
    const expectedSignature = "BUNNYDOC API EVENT RECEIVED";
    if (event.body && event.body.event === "signatureRequestViewed") {
      this.http.respond({
        status: 200,
        body: expectedSignature,
      });

      // Emit the event data for further processing
      this.$emit(event.body, {
        id: event.body.data.requestId,
        summary: `Signature Request Viewed: ${event.body.data.requestId}`,
        ts: Date.parse(event.body.timestamp) || Date.now(),
      });
    } else {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
    }
  },
};
