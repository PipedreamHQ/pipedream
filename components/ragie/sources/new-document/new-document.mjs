import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import ragie from "../../ragie.app.mjs";

export default {
  key: "ragie-new-document",
  name: "New Document Created",
  description: "Emits a new event whenever a new document is created in Ragie. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ragie: {
      type: "app",
      app: "ragie",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastCreatedAt() {
      return this.db.get("lastCreatedAt") ?? "1970-01-01T00:00:00Z";
    },
    _setLastCreatedAt(ts) {
      return this.db.set("lastCreatedAt", ts);
    },
  },
  hooks: {
    async deploy() {
      const pageSize = 50;
      let cursor = null;
      const response = await this.ragie.listDocuments({
        page_size: pageSize,
        cursor,
      });
      const documents = response.documents.reverse(); // Emit oldest first

      for (const doc of documents) {
        this.$emit(doc, {
          id: doc.id,
          summary: `New Ragie Document: ${doc.name || doc.id}`,
          ts: Date.parse(doc.created_at),
        });
      }

      if (documents.length > 0) {
        const latestCreatedAt = documents[documents.length - 1].created_at;
        await this._setLastCreatedAt(latestCreatedAt);
      }
    },
    async activate() {
      // No action needed on activate for a polling source
    },
    async deactivate() {
      // No action needed on deactivate for a polling source
    },
  },
  async run() {
    const lastCreatedAt = await this._getLastCreatedAt();
    let cursor = null;
    let hasMore = true;
    let newLastCreatedAt = lastCreatedAt;

    while (hasMore) {
      const response = await this.ragie.listDocuments({
        page_size: 100,
        cursor,
      });
      const newDocuments = response.documents
        .filter((doc) => new Date(doc.created_at) > new Date(lastCreatedAt))
        .reverse(); // Emit oldest first

      for (const doc of newDocuments) {
        this.$emit(doc, {
          id: doc.id,
          summary: `New Ragie Document: ${doc.name || doc.id}`,
          ts: Date.parse(doc.created_at),
        });

        if (doc.created_at > newLastCreatedAt) {
          newLastCreatedAt = doc.created_at;
        }
      }

      if (response.documents.length < 100 || !response.pagination?.next_cursor) {
        hasMore = false;
      } else {
        cursor = response.pagination.next_cursor;
      }
    }

    if (newLastCreatedAt > lastCreatedAt) {
      await this._setLastCreatedAt(newLastCreatedAt);
    }
  },
};
