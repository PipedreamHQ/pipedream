import crypto from "crypto";
import taiga from "../../taiga.app.mjs";

export default {
  props: {
    taiga,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    projectId: {
      propDefinition: [
        taiga,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the webhook.",
    },
  },
  methods: {
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _getSecretKey() {
      return this.db.get("secretKey");
    },
    _setSecretKey(secretKey) {
      this.db.set("secretKey", secretKey);
    },
    validateSecretKey(headers, bodyRaw) {
      const secretKey = this._getSecretKey();
      const signature = headers["x-taiga-webhook-signature"];
      const hmac = crypto.createHmac("sha1", secretKey);
      hmac.update(bodyRaw);
      const signedMessage = hmac.digest("hex");

      if (signature !== signedMessage) {
        return this.http.respond({
          status: 401,
        });
      }
    },
  },
  hooks: {
    async activate() {
      const secretKey = crypto.randomUUID();
      const response = await this.taiga.createHook({
        data: {
          key: secretKey,
          name: this.name,
          url: this.http.endpoint,
          project: this.projectId,
        },
      });
      this._setWebhookId(response.id);
      this._setSecretKey(secretKey);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.taiga.deleteHook(webhookId);
    },
  },
  async run({
    body, headers, bodyRaw,
  }) {
    if (!this.filterEvent(body)) return;
    this.validateSecretKey(headers, bodyRaw);

    const ts = body.created || Date.now();
    this.$emit(body, {
      id: `${body.id}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
