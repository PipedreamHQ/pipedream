import faceup from "../../faceup.app.mjs";

export default {
  key: "faceup-new-message-instant",
  name: "New Message Instant",
  description: "Emit new event when a new message from a sender is created. [See the documentation](https://support.faceup.com/en/article/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    faceup: {
      type: "app",
      app: "faceup",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    senderId: {
      propDefinition: [
        faceup,
        "senderId",
      ],
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.faceup.createWebhook({
        url: this.http.endpoint,
        event: "MessageCreated",
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.faceup.deleteWebhook(webhookId);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (body.senderId !== this.senderId) {
      return;
    }

    const hmac = crypto.createHmac("sha256", this.faceup.$auth.api_key);
    hmac.update(JSON.stringify(body));
    const computedSignature = hmac.digest("hex");

    if (headers["X-Faceup-Signature"] !== computedSignature) {
      return;
    }

    this.$emit(body, {
      id: body.id,
      summary: `New message from sender ${this.senderId}`,
      ts: Date.parse(body.createdAt),
    });
  },
};
