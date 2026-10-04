import {
  createHmac, timingSafeEqual,
} from "node:crypto";
import xquik from "../../xquik.app.mjs";
import sampleEmit from "./test-event.mjs";

const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000;
const MAX_STORED_NONCES = 500;

export default {
  key: "xquik-new-monitor-event-instant",
  name: "New Monitor Event (Instant)",
  description: "Emit new event when an Xquik account or keyword monitor reports activity, such as a new post, reply, quote, retweet, or profile change. Create a monitor in Xquik first. [See the documentation](https://docs.xquik.com/webhooks/overview)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    xquik,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    eventTypes: {
      propDefinition: [
        xquik,
        "eventTypes",
      ],
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.xquik.createWebhook({
        url: this.http.endpoint,
        eventTypes: this.eventTypes,
      });
      this._setWebhook({
        id: webhook.id,
        secret: webhook.secret,
      });
    },
    async deactivate() {
      const webhook = this._getWebhook();
      this._setWebhook(null);
      if (webhook?.id) {
        await this.xquik.deleteWebhook({
          webhookId: webhook.id,
        });
      }
    },
  },
  methods: {
    _getWebhook() {
      return this.db.get("webhook");
    },
    _setWebhook(webhook) {
      this.db.set("webhook", webhook);
    },
    _getNonces() {
      return this.db.get("nonces") ?? {};
    },
    _setNonces(nonces) {
      this.db.set("nonces", nonces);
    },
    /**
     * Keep nonces seen within the replay window and report whether this one is new.
     *
     * @param {string} nonce Delivery nonce.
     * @param {number} now Current time in milliseconds.
     * @returns {boolean} True when the nonce was not seen in the window.
     */
    _acceptNonce(nonce, now) {
      const recent = Object.fromEntries(
        Object.entries(this._getNonces())
          .filter(([
            , seenAt,
          ]) => now - seenAt < TIMESTAMP_TOLERANCE_MS)
          .slice(-MAX_STORED_NONCES),
      );
      if (recent[nonce]) {
        this._setNonces(recent);
        return false;
      }
      recent[nonce] = now;
      this._setNonces(recent);
      return true;
    },
    /**
     * Verify the HMAC-SHA256 signature over `<timestamp>.<nonce>.<rawBody>`.
     *
     * @param {object} event HTTP event.
     * @param {string} secret Webhook signing secret.
     * @returns {boolean} True when the signature and timestamp are valid.
     */
    _isSignedDelivery(event, secret) {
      const headers = event.headers ?? {};
      const timestamp = headers["x-xquik-timestamp"];
      const nonce = headers["x-xquik-nonce"];
      const signature = headers["x-xquik-signature"];
      if (!timestamp || !nonce || !signature || typeof event.bodyRaw !== "string") {
        return false;
      }

      const now = Date.now();
      if (Math.abs(now - Number(timestamp)) > TIMESTAMP_TOLERANCE_MS) {
        return false;
      }

      const expected = Buffer.from(
        "sha256=" + createHmac("sha256", secret)
          .update(`${timestamp}.${nonce}.${event.bodyRaw}`)
          .digest("hex"),
      );
      const received = Buffer.from(String(signature));
      return expected.length === received.length && timingSafeEqual(expected, received);
    },
    generateMeta(payload) {
      const source = payload.username
        ? `@${payload.username}`
        : payload.query ?? `monitor ${payload.monitorId}`;
      return {
        id: payload.deliveryId,
        summary: `${payload.eventType} from ${source}`,
        ts: Date.parse(payload.occurredAt) || Date.now(),
      };
    },
  },
  async run(event) {
    const webhook = this._getWebhook();
    if (!webhook?.secret) {
      this.http.respond({
        status: 500,
      });
      throw new Error("Webhook secret is missing. Redeploy this source.");
    }

    if (!this._isSignedDelivery(event, webhook.secret)) {
      this.http.respond({
        status: 401,
      });
      console.log("Ignored a delivery with an invalid signature or timestamp.");
      return;
    }

    this.http.respond({
      status: 200,
    });

    const nonce = String(event.headers["x-xquik-nonce"]);
    if (!this._acceptNonce(nonce, Date.now())) {
      console.log("Ignored a replayed delivery.");
      return;
    }

    const payload = typeof event.body === "string"
      ? JSON.parse(event.body)
      : event.body;
    this.$emit(payload, this.generateMeta(payload));
  },
  sampleEmit,
};
