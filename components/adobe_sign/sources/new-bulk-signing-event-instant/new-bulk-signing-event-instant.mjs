import adobeSign from "../../adobe_sign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "adobe_sign-new-bulk-signing-event-instant",
  name: "New Bulk Signing Event (Instant)",
  description: "Emit new event when a bulk signing event occurs. [See the documentation](https://opensource.adobe.com/acrobat-sign/acrobat_sign_events/webhookeventsmegasign.html)",
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
    bulkSigningEvent: {
      propDefinition: [
        adobeSign,
        "bulkSigningEvent",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit historical bulk signing events (up to 50 most recent)
      // Since the API documentation and provided app file do not include a method
      // to fetch historical events, this block is intentionally left empty.
      // In practice, you would use `this.adobeSign.<method>` if it existed.
    },
    async activate() {
      // Create a webhook subscription
      // Since the API documentation and provided app file do not include a method
      // to create a webhook, this block is intentionally left empty.
      // In practice, you would use `this.adobeSign.<method>` if it existed.
    },
    async deactivate() {
      // Delete the webhook subscription
      // Since the API documentation and provided app file do not include a method
      // to delete a webhook, this block is intentionally left empty.
      // In practice, you would use `this.adobeSign.<method>` if it existed.
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate the incoming webhook signature if applicable
    // This is a placeholder since the actual signature validation process
    // is not provided in the app file or API documentation.
    // You would typically compare a computed signature with one sent in the headers.

    // Respond to the webhook immediately since customResponse is true
    this.http.respond({
      status: 200,
    });

    // Emit the event if the bulk signing event matches the selected event type
    if (body.event === this.bulkSigningEvent || this.bulkSigningEvent === "MEGASIGN_ALL") {
      this.$emit(body, {
        id: body.webhookNotificationId,
        summary: `New bulk signing event: ${body.event}`,
        ts: Date.parse(body.eventDate),
      });
    }
  },
};
