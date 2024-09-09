import agrello from "../../agrello.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agrello-new-signed-document-instant",
  name: "New Signed Document Instant",
  description: "Emit new event when a given document is signed by all parties. [See the documentation](https://api.agrello.io/public/webjars/swagger-ui/index.html)",
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
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const documents = await this.agrello.listDocuments();
      const signedDocuments = documents.filter((doc) => doc.status === "signed");
      for (const doc of signedDocuments.slice(0, 50)) {
        this.$emit(doc, {
          id: doc.id,
          summary: `Document signed: ${doc.name}`,
          ts: Date.parse(doc.updatedAt),
        });
      }
    },
    async activate() {
      const webhookId = await this.agrello.createWebhook({
        event: "document.signed",
        url: this.http.endpoint,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.agrello.deleteWebhook({
          id: webhookId,
        });
      }
    },
  },
  async run(event) {
    const { documentId } = event.body;
    const document = await this.agrello.getDocument({
      documentId,
    });
    if (document.status === "signed") {
      this.$emit(document, {
        id: document.id,
        summary: `Document signed: ${document.name}`,
        ts: Date.parse(document.updatedAt),
      });
    }
  },
};
