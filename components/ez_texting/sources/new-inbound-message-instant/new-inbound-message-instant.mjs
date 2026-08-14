import {
  createHmac, randomUUID, timingSafeEqual,
} from "crypto";
import app from "../../ez_texting.app.mjs";
import {
  HISTORICAL_EVENT_LIMIT, WEBHOOK_TYPES,
} from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "ez_texting-new-inbound-message-instant",
  name: "New Inbound Message (Instant)",
  description: "Emit new event when a contact replies to one of your messages. A `STOP` reply arrives here with `optOut: true` — EZ Texting has no dedicated opt-out event, so this is the only opt-out signal that is pushed rather than polled. [See the documentation](https://developers.eztexting.com/docs/webhooks-1)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getSecret() {
      return this.db.get("secret");
    },
    _setSecret(secret) {
      this.db.set("secret", secret);
    },
    /**
     * EZ Texting signs each callback with an HmacSHA256 of the JSON payload,
     * keyed by the secret registered with the subscription and base64-encoded
     * into the `X-Signature-256` header.
     * See https://developers.eztexting.com/docs/webhooks-1
     */
    isSignatureValid({
      bodyRaw, headers,
    }) {
      const secret = this._getSecret();
      const signature = headers?.["x-signature-256"];

      if (!secret || !signature) {
        return false;
      }

      const expected = Buffer.from(createHmac("sha256", secret)
        .update(bodyRaw)
        .digest("base64"));
      const received = Buffer.from(signature);

      return expected.length === received.length
        && timingSafeEqual(expected, received);
    },
    /**
     * Historical messages come back on the `Message` schema, while callbacks
     * use the leaner webhook payload. Map the former onto the latter so every
     * event this source emits has one shape.
     */
    normalizeMessage({
      id, contactNumber, userNumber, message, sentAt, optIn, optOut,
    }) {
      return {
        id,
        type: WEBHOOK_TYPES.INBOUND_TEXT_RECEIVED,
        fromNumber: contactNumber,
        toNumber: userNumber,
        message,
        received: sentAt,
        optIn,
        optOut,
      };
    },
    emitEvent(event) {
      this.$emit(event, {
        id: event.id,
        summary: `New message from ${event.fromNumber}${event.optOut === true
          ? " (opted out)"
          : ""}`,
        ts: event.received
          ? Date.parse(event.received)
          : Date.now(),
      });
    },
  },
  hooks: {
    async deploy() {
      // Best effort only: a failure here should not stop the source from
      // deploying, since the webhook below is what actually does the work.
      try {
        const { content = [] } = await this.app.listMessages({
          $: this,
          params: {
            "filters[incoming][eq]": true,
            "sort": "sentAt,desc",
            "size": HISTORICAL_EVENT_LIMIT,
          },
        });

        content
          .slice(0, HISTORICAL_EVENT_LIMIT)
          .reverse()
          .forEach((message) => this.emitEvent(this.normalizeMessage(message)));
      } catch (error) {
        console.log("Could not fetch historical messages", error);
      }
    },
    async activate() {
      const secret = randomUUID();

      const { id } = await this.app.createWebhook({
        $: this,
        data: {
          type: WEBHOOK_TYPES.INBOUND_TEXT_RECEIVED,
          callbackUrl: this.http.endpoint,
          secret,
        },
      });

      this._setSecret(secret);
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.app.deleteWebhook({
          $: this,
          hookId,
        });
      }
      this._setHookId(null);
      this._setSecret(null);
    },
  },
  async run({
    body, bodyRaw, headers,
  }) {
    if (!this.isSignatureValid({
      bodyRaw,
      headers,
    })) {
      console.log("Rejected a callback with a missing or invalid signature");
      this.http.respond({
        status: 401,
      });
      return;
    }

    this.http.respond({
      status: 200,
    });

    this.emitEvent(body);
  },
  sampleEmit,
};
