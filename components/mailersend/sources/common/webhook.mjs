import common from "./base.mjs";
import crypto from "crypto";

export default {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  hooks: {
    ...common.hooks,
    async activate() {
      const response = await this.app.createWebhook({
        url: this.http.endpoint,
        domainId: this.domainId,
        events: this.getEvents(),
      });
      this._setWebhookId(response.body.data.id);
      this._setSecretKey(response.body.data.secret);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.app.deleteWebhook({
        webhookId,
      });
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    checkSignature(currentSignature, data) {
      const secretKey = this._getSecretKey();
      const expectedSignature = crypto.createHmac("sha256", secretKey)
        .update(data, "utf8")
        .digest("hex");
      if (currentSignature !== expectedSignature) {
        throw new Error("checkSignature failed");
      }
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    _getSecretKey() {
      return this.db.get("secretKey");
    },
    _setSecretKey(webhookId) {
      this.db.set("secretKey", webhookId);
    },
  },
  async run(request) {
    this.checkSignature(request.headers.signature, request.bodyRaw);
    const { body } = request;
    if (body) {
      this.emitEvent(body);
    }
  },
};
