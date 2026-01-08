import { axios } from "@pipedream/platform";
import adobeSign from "../../adobe_sign.app.mjs";

export default {
  key: "adobe_sign-new-agreement-event-instant",
  name: "New Agreement Event (Instant)",
  description: "Emit new event when a specific library event occurs. [See the documentation](https://opensource.adobe.com/acrobat-sign/acrobat_sign_events/webhookeventslibrary.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    adobeSign,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    libraryEvent: {
      propDefinition: [
        adobeSign,
        "libraryEvent",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emit historical events here, if needed
    },
    async activate() {
      // Create a webhook subscription and save its ID for later use
      const { webhookId } = await this.adobeSign.createWebhook({
        libraryEvent: this.libraryEvent,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      // Delete the webhook subscription
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.adobeSign.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Perform signature validation if applicable
    const isValidSignature = this.adobeSign.validateWebhookSignature(headers, body);
    if (!isValidSignature) {
      this.http.respond({
        status: 401,
        body: "Invalid signature",
      });
      return;
    }

    // Emit the event
    this.$emit(body, {
      id: headers["x-adobe-sign-webhook-id"],
      summary: `New event: ${body.event}`,
      ts: Date.parse(body.eventDate),
    });

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
