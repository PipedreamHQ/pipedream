import formstackDocuments from "../../formstack_documents.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "formstack_documents-new-document-created",
  name: "New Document Created",
  description: "Emit new event when a new document is created. [See documentation](https://www.webmerge.me/developers?page=documents)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    formstackDocuments,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    generateMeta(doc) {
      return {
        id: doc.id,
        summary: doc.name,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const lastId = this._getLastId();
    let maxId = lastId;

    const documents = await this.formstackDocuments.listDocuments();
    for (const doc of documents) {
      if (doc.id > lastId) {
        const meta = this.generateMeta(doc);
        this.$emit(doc, meta);
        if (doc.id > maxId) {
          maxId = doc.id;
        }
      }
    }

    this._setLastId(maxId);
  },
};
