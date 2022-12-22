import square from "../../square.app.mjs";
import crypto from "crypto";

export default {
  props: {
    square,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
  },
  hooks: {
    async activate() {
      let name = "Pipedream Webhook for: ";
      const eventTypes = this.getEventTypes();
      if (eventTypes.length === 1) {
        name += eventTypes[0];
      } else {
        name += eventTypes.join(", ");
      }

      const response = await this.square.createWebhook({
        name,
        eventTypes: eventTypes,
        url: this.http.endpoint,
      });
      const {
        subscription: {
          id,
          signature_key: signatureKey,
        },
      } = response;
      this.setWebhookId(id);
      this.setSignatureKey(signatureKey);
    },
    async deactivate() {
      const id = this.getWebhookId();
      await this.square.deleteWebhook({
        id,
      });
    },
  },
  methods: {
    getEventTypes() {
      throw new Error("getEventTypes not implemented");
    },
    getSummary() {
      throw new Error("getSummary not implemented");
    },
    getTimestamp() {
      throw new Error("getTimestamp not implemented");
    },
    getWebhookId() {
      return this.db.get("webhookId");
    },
    setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    getSignatureKey() {
      return this.db.get("signatureKey");
    },
    setSignatureKey(signatureKey) {
      this.db.set("signatureKey", signatureKey);
    },
    validateSignature(body, signature) {
      const hmac = crypto.createHmac("sha256", this.getSignatureKey());
      hmac.update(this.http.endpoint + body);
      const hash = hmac.digest("base64");
      return hash === signature;
    },
  },
  async run(event) {
    const {
      headers,
      body,
      bodyRaw,
    } = event;

    if (!this.validateSignature(bodyRaw, headers["x-square-hmacsha256-signature"])) {
      console.log("Signature validation failed. Skipping event...");
      return;
    }

    const id = body.event_id;
    console.log(`Emitting event ${id}`);

    this.$emit(body, {
      id,
      summary: this.getSummary(body),
      ts: this.getTimestamp(body),
    });
  },
};
