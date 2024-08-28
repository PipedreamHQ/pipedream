import documenso from "../../documenso.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "documenso-new-document-created-instant",
  name: "New Document Created",
  description: "Emit new event when a new document is created. [See the documentation](https://docs.documenso.com/developers)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    documenso,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookUrl = this.http.endpoint;
      const { id } = await this.documenso.createWebhook({
        webhookUrl,
      });
      this.db.set("webhookId", id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.documenso.deleteWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (body && body.document) {
      const { document } = body;
      this.$emit(document, {
        id: document.id,
        summary: `New Document Created: ${document.title}`,
        ts: Date.parse(document.createdAt),
      });
    } else {
      console.log("No document data found in webhook payload");
    }
  },
};
