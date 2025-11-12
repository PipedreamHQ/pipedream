import app from "../../docsumo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Document Status Changed",
  description: "Emit new event when document status is changed",
  key: "docsumo-document-status-changed",
  version: "0.0.2",
  type: "source",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const documents = await this.listAllDocuments();
      this.setDocuments(this.getDocumentsStatusMap(documents));
    },
  },
  methods: {
    setDocuments(documents) {
      this.db.set("documents", documents);
    },
    getDocuments() {
      return this.db.get("documents") || {};
    },
    getDocumentsStatusMap(documents) {
      const documentsStatusMap = {};
      for (const document of documents) {
        documentsStatusMap[document.doc_id] = document.status;
      }
      return documentsStatusMap;
    },
    getDocumentsMappedByDocId(documents) {
      const documentsMap = {};
      for (const document of documents) {
        documentsMap[document.doc_id] = document;
      }
      return documentsMap;
    },
    async listAllDocuments(params) {
      const PAGE_SIZE = 200;
      let page = 0;
      const documents = [];

      while (true) {
        const res = await this.app.listDocuments({
          ...params,
          limit: PAGE_SIZE,
          offset: (page * PAGE_SIZE),
        });
        if (res.data.documents.length === 0) {
          break;
        }
        documents.push(...res.data.documents);
        page++;
      }

      return documents;
    },
    emitEvent(doc, isNew) {
      this.$emit(doc, {
        id: `${doc.doc_id}-${doc.status}`,
        summary: `${isNew
          ? "New"
          : "Changed"
        } - ${doc.doc_id}`,
        ts: Date.now(),
      });
    },
  },
  async run() {
    const documents = await this.listAllDocuments();
    const changedDocuments = [];
    const newDocuments = [];
    const documentsMappedByDocId = this.getDocumentsMappedByDocId(documents);
    const prevDocumentsStatusMap = this.getDocuments();

    // Iterate over documentsStatusMap map
    for (const [
      docId,
      doc,
    ] of Object.entries(documentsMappedByDocId)) {
      // If document is new
      if (!prevDocumentsStatusMap[docId]) {
        newDocuments.push(doc);
      }

      // If document status has changed
      else if (prevDocumentsStatusMap[docId] !== doc.status) {
        changedDocuments.push(doc);
      }
    }

    this.setDocuments(this.getDocumentsStatusMap(documents));
    for (const doc of changedDocuments) {
      this.emitEvent(doc, false);
    }
    for (const doc of newDocuments) {
      this.emitEvent(doc, true);
    }
  },
};
