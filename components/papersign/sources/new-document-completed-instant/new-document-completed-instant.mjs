import papersign from "../../papersign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "papersign-new-document-completed-instant",
  name: "New Document Completed (Instant)",
  description: "Emit new event when a document is completed, i.e., all signers have signed. [See the documentation](https://paperform.readme.io/reference/getting-started-1)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    papersign,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const documents = await this.papersign.listDocuments();
      const completedDocs = documents.filter((doc) => doc.status === "completed");
      for (const doc of completedDocs) {
        this.$emit(doc, {
          id: doc.id,
          summary: `Document ${doc.name} completed`,
          ts: Date.parse(doc.updated_at),
        });
      }
    },
    async activate() {
      const webhookData = {
        name: "Document Completed Webhook",
        target_url: this.http.endpoint,
        triggers: [
          "document.completed",
        ],
      };
      const response = await axios(this, {
        method: "POST",
        url: `${this.papersign._baseUrl()}/webhooks`,
        headers: {
          Authorization: `Bearer ${this.papersign.$auth.api_key}`,
        },
        data: webhookData,
      });
      this.db.set("webhookId", response.webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.papersign._baseUrl()}/webhooks/${webhookId}`,
          headers: {
            Authorization: `Bearer ${this.papersign.$auth.api_key}`,
          },
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const doc = event.body;
    this.$emit(doc, {
      id: doc.id,
      summary: `Document ${doc.name} completed`,
      ts: Date.parse(doc.updated_at),
    });
  },
};
