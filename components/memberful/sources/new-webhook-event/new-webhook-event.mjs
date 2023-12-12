import crypto from "crypto";
import app from "../../memberful.app.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  type: "source",
  key: "memberful-new-webhook-event",
  name: "New Webhook Event",
  description: "Emit new event in Pipedream when a subscribed event is triggered in memberful.",
  version: "0.0.1",
  props: {
    app,
    http: "$.interface.http",
    secret: {
      type: "string",
      label: "Secret",
      description: "The secret used to sign the webhook. First you need to create this source with a random secret, then [create  webhook in Memberful](https://memberful.com/help/custom-development-and-api/webhooks/#create-an-endpoint) with the source endpoint, then go back to this source and update the secret with the one from Memberful.",
    },
  },
  methods: {
    verifyHmacSignature(rawBody, signature, secret) {
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(rawBody);
      const digest = hmac.digest("hex");
      return digest === signature;
    },
    emitEvent(event) {
      this.$emit(event, {
        summary: event.event,
        id: uuidv4(),
        ts: Date.now(),
      });
    },
  },
  async run(req) {
    if (!this.verifyHmacSignature(req.bodyRaw, req.headers["x-memberful-webhook-signature"], this.secret)) {
      throw new Error("Invalid signature");
    }
    this.emitEvent(req.body);
  },
};
