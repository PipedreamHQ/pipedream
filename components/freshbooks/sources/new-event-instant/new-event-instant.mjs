import crypto from "crypto";
import { WEBHOOK_EVENTS } from "../../common/constants.mjs";
import freshbooks from "../../freshbooks.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "freshbooks-new-event-instant",
  name: "New Event (Instant)",
  description: "Emit new event when a subscribed FreshBooks event occurs (e.g. invoice created, client updated). [See the documentation](https://www.freshbooks.com/api/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    freshbooks,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    accountId: {
      propDefinition: [
        freshbooks,
        "accountId",
      ],
    },
    event: {
      type: "string",
      label: "Event",
      description: "The event to listen for",
      options: WEBHOOK_EVENTS,
    },
  },
  methods: {
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _getVerifier() {
      return this.db.get("verifier");
    },
    _setVerifier(verifier) {
      this.db.set("verifier", verifier);
    },
    _canonicalBodyForSignature(body) {
      const msg = Object.fromEntries(
        Object.entries(body).map(([
          k,
          v,
        ]) => [
          k,
          String(v),
        ]),
      );
      return JSON.stringify(msg)
        .replace(/":/g, "\": ")
        .replace(/",/g, "\", ");
    },
    _verifySignature(body, signature, verifier) {
      const payload = this._canonicalBodyForSignature(body);
      const calculated = crypto
        .createHmac("sha256", verifier)
        .update(payload, "utf8")
        .digest("base64");
      return signature === calculated;
    },
  },
  hooks: {
    async activate() {
      const { response: { result: { callback } } } = await this.freshbooks.createHook({
        accountId: this.accountId,
        data: {
          callback: {
            uri: this.http.endpoint,
            event: this.event,
          },
        },
      });

      this._setWebhookId(callback.callbackid);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.freshbooks.deleteHook({
        accountId: this.accountId,
        webhookId,
      });
    },
  },
  async run({
    body, headers,
  }) {
    const sendOk = () => {
      this.http.respond({
        status: 200,
        body: "OK",
      });
    };

    if (!body || typeof body !== "object") {
      sendOk();
      return;
    }

    const verifier = body.verifier;
    if (verifier) {
      const callbackId = this._getWebhookId();
      if (callbackId) {
        await this.freshbooks.verifyCallback({
          accountId: this.accountId,
          callbackId,
          data: {
            callback: {
              verifier,
            },
          },
        });
        this._setVerifier(verifier);
      }
      sendOk();
      return;
    }

    const storedVerifier = this._getVerifier();
    if (storedVerifier && headers) {
      const signature = headers["x-freshbooks-hmac-sha256"];
      if (signature && !this._verifySignature(body, signature, storedVerifier)) {
        this.http.respond({
          status: 401,
          body: "Invalid signature",
        });
        return;
      }
    }

    this.$emit(body, {
      id: `${body.object_id}-${Date.now()}`,
      summary: `${body.name || "event"} (object_id: ${body.object_id})`,
      ts: Date.now(),
    });
    sendOk();
  },
  sampleEmit,
};
