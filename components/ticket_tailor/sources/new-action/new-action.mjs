import app from "../../ticket_tailor.app.mjs";
import crypto from "crypto";

export default {
  type: "source",
  dedupe: "unique",
  key: "ticket_tailor-new-event",
  name: "New Action (Instant)",
  description: "Emit new event when a new action occurs. You can use this source to handle one of the available options in Ticket Tailor. See how to configure the webhok [here](https://developers.tickettailor.com/#configuration)",
  version: "0.0.1",
  props: {
    app,
    http: "$.interface.http",
    sharedSecret: {
      type: "string",
      label: "Shared Secret",
      description: "The shared secret you configured in the webhook. We highly recommend you to use a secret key to prevent unauthorized access to your webhook. You can find your signing secret [here](https://app.tickettailor.com/box-office/webhooks)",
      optional: true,
    },
  },
  methods: {
    emit(event) {
      this.$emit(event, {
        id: event.id,
        summary: `${event.event} - ${event.payload?.name || event.id}`,
        ts: event.created_at || Date.now(),
      });
    },
    getSignature(event) {
      const calendlySignature = event.headers["tickettailor-webhook-signature"];
      return calendlySignature.split(",").reduce((acc, currentValue) => {
        const [
          key,
          value,
        ] = currentValue.split("=");
        acc[key] = value;
        return acc;
      }, {});
    },
    checkHmac(bodyRaw, timestamp, hmac) {
      if (!this.sharedSecret) {
        console.log("No shared secret configured. Skipping HMAC check.");
        return;
      }

      const data = timestamp + bodyRaw;
      const expectedSignature = crypto.createHmac("sha256", this.sharedSecret)
        .update(data, "utf8")
        .digest("hex");

      if (hmac !== expectedSignature) {
        throw new Error("Invalid HMAC Signature, connection aborted.");
      }
    },
    checkTolerance(timestamp) {
      const fiveMinutes = 300000;
      const tolerance = fiveMinutes;
      const timestampMilliseconds = Number(timestamp) * 1000;

      if (timestampMilliseconds < Date.now() - tolerance) {
        throw new Error("Invalid Timestamp Signature. The signature's timestamp is outside of the tolerance zone.");
      }
    },
  },
  async run(event) {
    const {
      t,
      v1,
    } = this.getSignature(event);
    this.checkHmac(event.bodyRaw, t, v1);
    this.checkTolerance(t);
    this.emit(event.body);
  },
};
