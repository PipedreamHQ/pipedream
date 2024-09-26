import app from "../../calendly_v2.app.mjs";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export default {
  props: {
    app,
    http: "$.interface.http",
    db: "$.service.db",
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
      console.log("Generating signature key...");
      const uuidKey = uuidv4();
      this._setSignatureKey(uuidKey);

      console.log("Getting user info...");
      const userInfo = await this.app.getUserInfo();

      console.log("Registering webhook...");
      const webhook = await this.app.createWebhookSubscription(
        this.getEvent(),
        this.http.endpoint,
        userInfo.resource.current_organization,
        userInfo.resource.uri,
        uuidKey,
        this.getScope(),
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
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    getScope() {
      throw new Error("getScope is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
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
        this._setWebhook(null);
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

    const meta = this.generateMeta(event.body);
    this.$emit(event.body, meta);

    console.log("Event processed");
  },
};
