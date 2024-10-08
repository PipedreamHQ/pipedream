import pdfmonkey from "../../pdfmonkey.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "pdfmonkey-new-document-generated",
  name: "New Document Generated",
  description: "Emit new event when a document's generation is completed. [See the documentation](https://docs.pdfmonkey.io/references/api/documents)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    pdfmonkey,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    documentId: {
      propDefinition: [
        pdfmonkey,
        "documentId",
      ],
    },
    documentName: {
      propDefinition: [
        pdfmonkey,
        "documentName",
      ],
      optional: true,
    },
    additionalMetadata: {
      propDefinition: [
        pdfmonkey,
        "additionalMetadata",
      ],
      optional: true,
    },
  },
  methods: {
    async checkDocumentStatus() {
      return await this.pdfmonkey.findDocument(this.documentId);
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const document = await this.checkDocumentStatus();
      if (document.status === "success") {
        this.$emit(document, {
          id: document.id,
          summary: `Document ${this.documentName || document.filename} Generation Completed`,
          ts: Date.parse(document.updated_at),
          additionalMetadata: this.additionalMetadata,
        });
        this._setLastTimestamp(Date.parse(document.updated_at));
      }
    },
    async activate() {
      // No webhook subscription required
    },
    async deactivate() {
      // No webhook unsubscription required
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const document = await this.checkDocumentStatus();

    if (Date.parse(document.updated_at) > lastTimestamp && document.status === "success") {
      this.$emit(document, {
        id: document.id,
        summary: `Document ${this.documentName || document.filename} Generation Completed`,
        ts: Date.parse(document.updated_at),
        additionalMetadata: this.additionalMetadata,
      });
      this._setLastTimestamp(Date.parse(document.updated_at));
    }
  },
};
