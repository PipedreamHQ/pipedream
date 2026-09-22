import {
  createHmac, timingSafeEqual,
} from "node:crypto";
import app from "../../letmepost.app.mjs";
import sampleEmit from "./test-event.mjs";

const EVENT_TYPES = [
  "post.queued",
  "post.validated",
  "post.published",
  "post.rejected",
  "post.failed",
  "post.canceled",
  "post.rescheduled",
  "token.expiring",
  "token.revoked",
  "version.deprecated",
];

export default {
  key: "letmepost-new-webhook-event",
  name: "New Webhook Event (Instant)",
  description: "Emit new events the moment a post changes state or a token or version event fires. [See the documentation](https://docs.letmepost.dev/api-reference/webhooks/register-a-webhook-endpoint)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    events: {
      type: "string[]",
      label: "Events",
      description: "Which events to listen for. Leave empty to receive all events.",
      optional: true,
      options: EVENT_TYPES,
    },
  },
  hooks: {
    async activate() {
      const response = await this.app.createWebhookEndpoint({
        data: {
          url: this.http.endpoint,
          events: this.events ?? [],
          description: "Pipedream",
        },
      });
      this._setEndpointId(response.id);
      this._setSecret(response.signingSecret);
    },
    async deactivate() {
      const endpointId = this._getEndpointId();
      if (endpointId) {
        await this.app.deleteWebhookEndpoint({
          endpointId,
        });
      }
    },
  },
  methods: {
    _getEndpointId() {
      return this.db.get("endpointId");
    },
    _setEndpointId(endpointId) {
      this.db.set("endpointId", endpointId);
    },
    _getSecret() {
      return this.db.get("secret");
    },
    _setSecret(secret) {
      this.db.set("secret", secret);
    },
    _isValidSignature(secret, rawBody, signature) {
      const presented = signature.startsWith("sha256=")
        ? signature.slice("sha256=".length)
        : signature;
      const expected = createHmac("sha256", secret)
        .update(rawBody, "utf8")
        .digest("hex");
      if (presented.length !== expected.length) {
        return false;
      }
      try {
        return timingSafeEqual(
          Buffer.from(presented, "hex"),
          Buffer.from(expected, "hex"),
        );
      } catch {
        return false;
      }
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `${body.type}: ${body.data?.id ?? body.id}`,
        ts: Date.parse(body.createdAt) || Date.now(),
      };
    },
  },
  async run(event) {
    const secret = this._getSecret();
    const headers = event.headers ?? {};
    const signature = headers["x-letmepost-signature"] ?? headers["X-Letmepost-Signature"];
    const rawBody = event.bodyRaw;

    if (
      !secret ||
      typeof rawBody !== "string" ||
      typeof signature !== "string" ||
      !this._isValidSignature(secret, rawBody, signature)
    ) {
      this.http.respond({
        status: 401,
        body: "Invalid signature",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    const { body } = event;
    this.$emit(body, this.generateMeta(body));
  },
  sampleEmit,
};
