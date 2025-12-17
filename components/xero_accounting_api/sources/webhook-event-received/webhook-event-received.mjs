import crypto from "crypto";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-webhook-event-received",
  name: "Webhook Event Received (Instant)",
  description: "Emit new event for each incoming webhook notification. To create a Xero Webhook, please follow [the instructions here](https://developer.xero.com/documentation/guides/webhooks/creating-webhooks/).",
  version: "0.0.3",
  type: "source",
  props: {
    xeroAccountingApi,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    webhookKey: {
      type: "string",
      label: "Webhook Key",
      description: "You can leave this blank when creating this source. After creating a webhook in Xero, please update this prop with the value provided.",
      secret: true,
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      console.log("You can now copy the generated URL endpoint from this source and go to Xero and create a webhook.");
      console.log("After saving, copy the `Webhooks key` and update the prop.");
      console.log("Then click on `Send 'Intent to receive'` to start the signature verification process.");
      console.log("We will receive three requests for signature verification, and after that the `Status` should be OK.");
    },
  },
  methods: {
    httpRespond(status) {
      this.http.respond({
        status,
      });
    },
    validateEvent(event) {
      if (!this.webhookKey) {
        console.log("No webhook key supplied. Please update the prop with the value supplied by Xero.");
        return false;
      }

      console.log("Verifying signature...");
      const sig = crypto.createHmac("sha256", this.webhookKey)
        .update(event.bodyRaw)
        .digest("base64");
      return sig === event.headers["x-xero-signature"];
    },
    emitEvents(events) {
      events.forEach((event) => {
        const {
          resourceId: id,
          eventDateUtc: ts,
          eventType,
          eventCategory,
        } = event;

        this.$emit(event, {
          id,
          summary: `${eventCategory} ${eventType} event received`,
          ts: new Date(ts),
        });
      });
    },
  },
  async run(event) {
    if (!this.validateEvent(event)) {
      console.log("Invalid signature. Ignoring event...");
      this.httpRespond(401);
    }

    this.httpRespond(200);
    this.emitEvents(event.body?.events);
  },
};
