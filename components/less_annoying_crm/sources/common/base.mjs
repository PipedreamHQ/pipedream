import crypto from "crypto";
import app from "../../less_annoying_crm.app.mjs";

export default {
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    _getHookSecret() {
      return this.db.get("hookSecret");
    },
    _setHookSecret(secret) {
      this.db.set("hookSecret", secret);
    },
    // The docs don't state whether X-Hook-Signature is hex or base64, so accept both.
    _isValidSignature(rawBody, signature) {
      const secret = this._getHookSecret();
      if (!secret || !signature) {
        return false;
      }
      const hmac = crypto.createHmac("sha256", secret).update(rawBody);
      const digest = hmac.digest();
      return [
        digest.toString("hex"),
        digest.toString("base64"),
      ].some((expected) => {
        const a = Buffer.from(expected);
        const b = Buffer.from(signature);
        return a.length === b.length && crypto.timingSafeEqual(a, b);
      });
    },
    /**
     * The Less Annoying CRM event name to subscribe to, e.g. `Contact.Create`.
     */
    getEventName() {
      throw new Error("getEventName is not implemented");
    },
    /**
     * Loads the full records referenced by a webhook payload (which contains IDs only).
     */
    fetchRecords() {
      throw new Error("fetchRecords is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  hooks: {
    async activate() {
      const { WebhookId } = await this.app.createWebhook({
        parameters: {
          EndpointUrl: this.http.endpoint,
          Events: [
            this.getEventName(),
          ],
          WebhookScope: "Account",
        },
      });
      this._setWebhookId(WebhookId);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.app.deleteWebhook({
          parameters: {
            WebhookId: webhookId,
          },
        });
      }
    },
  },
  async run({
    body, bodyRaw, headers,
  }) {
    // Handshake: echo X-Hook-Secret and keep it as the signing key.
    const hookSecret = headers["x-hook-secret"];
    if (hookSecret) {
      this._setHookSecret(hookSecret);
      return this.http.respond({
        status: 200,
        headers: {
          "X-Hook-Secret": hookSecret,
        },
      });
    }

    const rawBody = bodyRaw ?? JSON.stringify(body);
    if (!this._isValidSignature(rawBody, headers["x-hook-signature"])) {
      return this.http.respond({
        status: 401,
        body: "Invalid signature",
      });
    }

    // Acknowledge quickly; any status below 300 counts as delivered.
    this.http.respond({
      status: 200,
    });

    if (body.TriggeringEvent !== this.getEventName()) {
      return;
    }

    const records = await this.fetchRecords(body);
    for (const record of records) {
      this.$emit(record, this.generateMeta(record));
    }
  },
};
