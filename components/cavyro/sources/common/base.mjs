import crypto from "crypto";
import cavyro from "../../cavyro.app.mjs";
import { buildEventId } from "../../common/utils.mjs";

export default {
  props: {
    cavyro,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const {
        id, secret,
      } = await this.cavyro.createWebhook({
        data: {
          webhook_subscription: {
            url: this.http.endpoint,
            event_types: this.getEventTypes(),
            label: "Pipedream",
          },
        },
      });
      this._setWebhookId(id);
      this._setSecret(secret);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.cavyro.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    _getSecret() {
      return this.db.get("secret");
    },
    _setSecret(secret) {
      this.db.set("secret", secret);
    },
    _isSignatureValid({
      headers, bodyRaw, rawBody,
    }) {
      const signature = headers["x-cavyro-signature"];
      const secret = this._getSecret();
      if (typeof signature !== "string" || !secret) {
        return false;
      }
      const expected = Buffer.from(`sha256=${crypto.createHmac("sha256", secret).update(bodyRaw ?? rawBody ?? "")
        .digest("hex")}`);
      const received = Buffer.from(signature);
      return received.length === expected.length
        && crypto.timingSafeEqual(received, expected);
    },
    getEventTypes() {
      throw new Error("getEventTypes is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    generateMeta(body) {
      const {
        event, occurred_at: occurredAt, data,
      } = body;
      return {
        id: buildEventId(event, data.id, occurredAt),
        summary: this.getSummary(body),
        ts: Date.parse(occurredAt) || Date.now(),
      };
    },
  },
  async run(event) {
    if (!this._isSignatureValid(event)) {
      this.http.respond({
        status: 401,
      });
      return;
    }
    const { body } = event;
    if (!body?.data?.id) {
      this.http.respond({
        status: 400,
      });
      return;
    }
    this.http.respond({
      status: 200,
    });
    this.$emit(body, this.generateMeta(body));
  },
};
