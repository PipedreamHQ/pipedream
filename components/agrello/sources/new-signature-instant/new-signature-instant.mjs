import agrello from "../../agrello.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "agrello-new-signature-instant",
  name: "New Signature Added to Document",
  description: "Emit new event when a signature is added to a document. [See the documentation](https://api.agrello.io/public/webjars/swagger-ui/index.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    agrello: {
      type: "app",
      app: "agrello",
    },
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
      const documents = await this.agrello.listDocuments();
      for (const document of documents) {
        const signatures = document.signatures || [];
        for (const signature of signatures) {
          this.$emit(signature, {
            id: signature.id,
            summary: `New signature added to document: ${document.name}`,
            ts: Date.parse(signature.timestamp),
          });
        }
      }
    },
    async activate() {
      const webhookId = await this.agrello.createWebhook({
        url: this.http.endpoint,
        event: "document_signature_added",
      });
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.agrello.deleteWebhook(webhookId);
      }
    },
  },
  async run(event) {
    const computedSignature = crypto
      .createHmac("sha256", this.agrello.$auth.secret)
      .update(event.body)
      .digest("base64");

    if (computedSignature !== event.headers["x-agrello-signature"]) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.$emit(event.body, {
      id: event.body.id,
      summary: `New signature added to document ${event.body.documentId}`,
      ts: Date.parse(event.body.timestamp),
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
