import documerge from "../../documerge.app.mjs";

export default {
  key: "documerge-new-merged-document-instant",
  name: "New Merged Document Instant",
  description: "Emits a new event when a merged document is created in documerge.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    documerge,
    documentTypes: documerge.propDefinitions.documentTypes,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { documentTypes } = this;
      for (const type of documentTypes) {
        await this.documerge.createDocument({
          data: {
            type,
            status: "Active",
          },
        });
      }
    },
    async deactivate() {
      const documentId = this.db.get("documentId");
      await this.documerge.deleteDocument(documentId);
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    if (headers["Content-Type"] !== "application/json") {
      return;
    }
    const { data } = body;
    if (!this.documentTypes.includes(data.type)) {
      return;
    }
    this.$emit(data, {
      id: data.id,
      summary: `New merged document of type ${data.type}`,
      ts: Date.parse(data.created_at),
    });
  },
};
