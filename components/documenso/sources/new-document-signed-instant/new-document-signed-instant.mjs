import documenso from "../../documenso.app.mjs";

export default {
  key: "documenso-new-document-signed-instant",
  name: "New Document Signed Instant",
  description: "Emits an event when a document is signed by a recipient",
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
      const { data } = await this.documenso._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          url: this.http.endpoint,
          event_type: "document.signed",
        },
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.documenso._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.body.id,
      summary: `Document signed: ${event.body.document_id}`,
      ts: Date.now(),
    });
  },
};
