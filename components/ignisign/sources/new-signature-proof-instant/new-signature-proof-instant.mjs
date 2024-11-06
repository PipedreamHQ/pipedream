import ignisign from "../../ignisign.app.mjs";
import crypto from "crypto";

export default {
  key: "ignisign-new-signature-proof-instant",
  name: "New Signature Proof Instant",
  description: "Emit new event when a signature proof is generated. [See the documentation](https://ignisign.io/docs/webhooks/signatureproof)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ignisign,
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
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      await this.ignisign.emitSignatureProofEvent();
    },
    async activate() {
      const response = await this.ignisign._makeRequest({
        method: "POST",
        path: `/v4/applications/${this.ignisign.$auth.appId}/envs/${this.ignisign.$auth.appEnv}/webhooks`,
        data: {
          url: this.http.endpoint,
          description: "Webhook for receiving Ignisign signature proof events",
        },
      });
      this._setWebhookId(response._id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.ignisign._makeRequest({
          method: "DELETE",
          path: `/v4/webhooks/${webhookId}`,
        });
      }
    },
  },
  async run(event) {
    const signatureProofData = event.body;
    const token = this._getWebhookId();
    const computedSignature = crypto.createHmac("sha256", token).update(event.rawBody)
      .digest("base64");

    if (computedSignature !== event.headers["x-signature"]) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
    });
    this.$emit(signatureProofData, {
      id: signatureProofData.signatureRequestId,
      summary: `New signature proof generated for document ID: ${signatureProofData.documentId}`,
      ts: Date.now(),
    });
  },
};
