import agentset from "../../agentset.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agentset-new-document",
  name: "New Document Created",
  description: "Emit a new event when a new document is created. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/documents/list)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    agentset,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900,
      },
    },
    namespaceId: {
      propDefinition: [
        agentset,
        "namespaceId",
      ],
    },
    documentStatuses: {
      propDefinition: [
        agentset,
        "documentStatuses",
      ],
    },
  },
  methods: {
    async _getDocuments(cursor) {
      return this.agentset.listDocuments(this.namespaceId, {
        params: {
          statuses: this.documentStatuses,
          cursor,
          orderBy: "createdAt",
          order: "desc",
        },
      });
    },
    _getStoredCursor() {
      return this.db.get("cursor") || null;
    },
    _setStoredCursor(cursor) {
      this.db.set("cursor", cursor);
    },
  },
  hooks: {
    async deploy() {
      const {
        data, pagination,
      } = await this._getDocuments();
      for (const doc of data.slice(0, 50).reverse()) {
        this.$emit(doc, {
          id: doc.id,
          summary: `New Document: ${doc.name || doc.id}`,
          ts: new Date(doc.createdAt).getTime(),
        });
      }
      if (pagination.nextCursor) {
        this._setStoredCursor(pagination.nextCursor);
      }
    },
  },
  async run() {
    let cursor = this._getStoredCursor();
    while (true) {
      const {
        data, pagination,
      } = await this._getDocuments(cursor);
      for (const doc of data.reverse()) {
        this.$emit(doc, {
          id: doc.id,
          summary: `New Document: ${doc.name || doc.id}`,
          ts: new Date(doc.createdAt).getTime(),
        });
      }

      if (!pagination.nextCursor || data.length === 0) break;
      cursor = pagination.nextCursor;
    }

    // Update cursor for next run
    this._setStoredCursor(cursor);
  },
};
