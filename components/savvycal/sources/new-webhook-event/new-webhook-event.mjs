import app from "../../savvycal.app.mjs";
import options from "../../common/options.mjs";
import crypto from "crypto";

export default {
  key: "savvycal-new-webhook-event",
  name: "New Webhook Event (Instant)",
  description: "Emit new event when a new webhook event occurs. Please add this Source URL as one of your webhook in [SavvyCal Integration](https://savvycal.com/integrations) > Webhooks.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
    webhookEventTypes: {
      type: "string[]",
      label: "Webhook Event Types",
      description: "The event types to watch for",
      options: options.WEBHOOK_EVENT_TYPES,
    },
    sharedSecret: {
      type: "string",
      label: "Shared Secret",
      description: "The shared secret you configured in the webhook. We highly recommend you to use a secret key to prevent unauthorized access to your webhook.",
      optional: true,
    },
  },
  methods: {
    checkHmac(bodyRaw, hmac) {
      if (!this.sharedSecret || this.sharedSecret === "") {
        console.log("No shared secret configured. Skipping HMAC check.");
        return;
      }

      if (!hmac) {
        throw new Error("Missing HMAC Signature, connection aborted.");
      }

      const expectedSignature = crypto.createHmac("sha256", this.sharedSecret)
        .update(bodyRaw, "utf8")
        .digest("hex");

      if (hmac.toLowerCase() !== `sha256=${expectedSignature}`) {
        throw new Error("Invalid HMAC Signature, connection aborted.");
      }
    },
  },
  async run(event) {
    this.checkHmac(
      event.bodyRaw,
      event.headers["x-savvycal-signature"],
    );

    if (this.webhookEventTypes.indexOf(event.body.type) === -1) {
      console.log("Ignoring event of type", event.body.type);
      return;
    }
    this.$emit(event.body,  {
      summary: `${event.body.type} - ${event.body.id}`,
      id: event.body.id,
      ts: event.body.occurred_at || Date.now(),
    });
  },
};
