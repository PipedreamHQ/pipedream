import { createHmac } from "crypto";

export default {
  key: "quaderno-payment-received",
  name: "New Payment Received",
  description: "Emit new event when a payment is successfully processed in Quaderno. [See the Documentation](https://developers.quaderno.io/api/#tag/Webhooks/operation/createWebhook).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    quaderno: {
      type: "app",
      app: "quaderno",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const response =
        await this.createWebhook({
          data: {
            url: this.http.endpoint,
            events_types: this.getEventName(),
          },
        });

      this.setWebhookId(response.id);
      this.setAuthKey(response.auth_key);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    createWebhook(args = {}) {
      return this.app.post({
        path: "/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/webhooks/${webhookId}`,
        ...args,
      });
    },
    setWebhookId(value) {
      this.db.set("webhookId", value);
    },
    getWebhookId() {
      return this.db.get("webhookId");
    },
    setAuthKey(value) {
      this.db.set("authKey", value);
    },
    getAuthKey() {
      return this.db.get("authKey");
    },
    getEventName() {
      return [
        "payment.created",
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Payment: ${resource.id}`,
        ts: Date.now(),
      };
    },
    isSignatureValid(signature, data, skip = true) {
      // skip signature validation for now. Due to the following issue:
      // https://github.com/quaderno/quaderno-api/issues/54
      if (skip) {
        return true;
      }
      const authKey = this.getAuthKey();
      const computedSignature = createHmac("sha1", authKey)
        .update(data)
        .digest("base64");

      return computedSignature === signature;
    },
    processEvent(event) {
      this.$emit(event, this.generateMeta(event.data?.object || event));
    },
  },
  async run({
    method, url, body, headers, bodyRaw,
  }) {
    if (method === "HEAD") {
      return this.http.respond({
        status: 200,
      });
    }

    const signature = headers["x-quaderno-signature"];
    const data = `${url}${bodyRaw}`;

    if (!this.isSignatureValid(signature, data)) {
      throw new Error("Invalid signature");
    }

    this.processEvent(body);
  },
};
