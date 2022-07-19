import app from "../../calendly_v2.app.mjs";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import constants from "../../common/constants.mjs";

export default {
  key: "calendly_v2-invitee-action",
  name: "New Invitee Action",
  description: "Emit new event when a invitee takes some action.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
    db: "$.service.db",
    events: {
      type: "string[]",
      label: "Events",
      description: "Events to listen to",
      options: constants.webhookEvents,
    },
  },
  methods: {
    _getWebhook() {
      return this.db.get("webhook");
    },
    _setWebhook(webhook) {
      this.db.set("webhook", webhook);
    },
    _getSignatureKey() {
      return this.db.get("signatureKey");
    },
    _setSignatureKey(signatureKey) {
      this.db.set("signatureKey", signatureKey);
    },
    _getWebhookUuid(webhookUri) {
      // "https://api.calendly.com/webhook_subscriptions/69a2dfaa-1a27-4930-b81b-1c7ac0ff6d7b" to "69a2dfaa-1a27-4930-b81b-1c7ac0ff6d7b"
      const splited = webhookUri.split("/");
      return splited[splited.length - 1];
    },
    async _deactivateWebhook(webhook) {
      console.log("Deleting webhook...");
      const res = await this.app.deleteWebhookSubscription(
        this._getWebhookUuid(webhook.uri),
      );
      console.log("Deleted webhook");
      return res;
    },
    async _registerWebhook() {
      if (!this.events || this.events.length === 0) {
        throw new Error("No events to listen to, please choose at least one.");
      }
      console.log("Generating signature key...");
      const uuidKey = uuidv4();
      this._setSignatureKey(uuidKey);

      console.log("Getting user info...");
      const userInfo = await this.app.getUserInfo();

      console.log("Registering webhook...");
      const webhook = await this.app.createWebhookSubscription(
        this.events,
        this.http.endpoint,
        userInfo.resource.current_organization,
        userInfo.resource.uri,
        uuidKey,
      );

      this._setWebhook(webhook.resource);
      console.log("Webhook registered!");
    },
    _getCalendlySignature(event) {
      const calendlySignature = event.headers["calendly-webhook-signature"];
      const {
        t,
        signature,
      } = calendlySignature.split(",").reduce((acc, currentValue) => {
        const [
          key,
          value,
        ] = currentValue.split("=");

        if (key === "t") {
          acc.t = value;
        }

        if (key === "v1") {
          acc.signature = value;
        }

        return acc;
      }, {
        t: "",
        signature: "",
      });
      return {
        t,
        signature,
      };
    },
    _checkHmac(t, hmac, bodyRaw) {
      console.log("Checking HMAC...");
      const signatureKey = this._getSignatureKey();
      const data = `${t}.${bodyRaw}`;
      const expectedSignature = crypto.createHmac("sha256", signatureKey)
        .update(data, "utf8")
        .digest("hex");

      if (hmac !== expectedSignature) {
        throw new Error("Invalid HMAC Signature, connection aborted.");
      }
    },
    _checkReplayAttack(t) {
      console.log("Checking for Replay Attack...");
      const tolerance = 180000; // threeMinutes
      const timestampMilliseconds = Number(t) * 1000;

      if (timestampMilliseconds < Date.now() - tolerance) {
        throw new Error("Invalid Timestamp Signature. The signature's timestamp is outside of the tolerance zone.");
      }
    },
  },
  hooks: {
    async activate() {
      const previousWebhook = this._getWebhook();
      if (previousWebhook) {
        await this._deactivateWebhook(previousWebhook);
      }

      await this._registerWebhook();
    },
    async deactivate() {
      const previousWebhook = this._getWebhook();
      if (previousWebhook) {
        await this._deactivateWebhook(previousWebhook);
      }
    },
  },
  async run(event) {
    console.log("Event received");
    // https://developer.calendly.com/api-docs/ZG9jOjM2MzE2MDM4-webhook-signatures
    const {
      t,
      signature,
    } = this._getCalendlySignature(event);
    if (!t || !signature) throw new Error("Invalid Signature");

    this._checkHmac(t, signature, event.bodyRaw);
    this._checkReplayAttack(t);

    this.$emit(event.body, {
      id: `${event.body.event}-${event.body.payload.uri}`,
      summary: `${event.body.payload.name} - ${event.body.event}`,
      ts: Date.now(),
    });
    console.log("Event processed");
  },
};
