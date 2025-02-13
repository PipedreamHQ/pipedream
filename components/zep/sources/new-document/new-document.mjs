import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import zep from "../../zep.app.mjs";

export default {
  key: "zep-new-document",
  name: "New Document Created",
  description: "Emit new event when a new document is created in Zep. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    zep,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workspace: {
      propDefinition: [
        zep,
        "workspace",
      ],
    },
    folder: {
      propDefinition: [
        zep,
        "folder",
      ],
      optional: true,
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    _emitDocument(document) {
      const timestamp = Date.parse(document.created) || Date.now();
      this.$emit(document, {
        id: document.id || timestamp,
        summary: `New Document: ${document.title}`,
        ts: timestamp,
      });
    },
  },
  hooks: {
    async deploy() {
      const documents = await this.zep.getDocuments({
        workspaceId: this.workspace,
        folderId: this.folder,
        perpage: 50,
      });
      const sortedDocuments = documents.sort(
        (a, b) => new Date(b.created) - new Date(a.created),
      );
      const recentDocuments = sortedDocuments.slice(0, 50).reverse();
      for (const doc of recentDocuments) {
        this._emitDocument(doc);
      }
      if (recentDocuments.length > 0) {
        const lastDoc = recentDocuments[recentDocuments.length - 1];
        this._setLastTimestamp(Date.parse(lastDoc.created));
      }
    },
    async activate() {
      // No webhook activation needed for polling source
    },
    async deactivate() {
      // No webhook deactivation needed for polling source
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const documents = await this.zep.getDocuments({
      workspaceId: this.workspace,
      folderId: this.folder,
      perpage: 100,
    });
    const newDocuments = documents.filter(
      (doc) => Date.parse(doc.created) > lastTimestamp,
    );
    const sortedNewDocuments = newDocuments.sort(
      (a, b) => new Date(a.created) - new Date(b.created),
    );
    for (const doc of sortedNewDocuments) {
      this._emitDocument(doc);
    }
    if (sortedNewDocuments.length > 0) {
      const latestDoc = sortedNewDocuments[sortedNewDocuments.length - 1];
      this._setLastTimestamp(Date.parse(latestDoc.created));
    }
  },
};
