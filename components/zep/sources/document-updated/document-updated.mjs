import zep from "../../zep.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "zep-document-updated",
  name: "Document Updated",
  description: "Emit new events when an existing document is updated. [See the documentation]()",
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
    document: {
      propDefinition: [
        zep,
        "document",
      ],
      optional: true,
    },
    fieldsToTrack: {
      propDefinition: [
        zep,
        "fieldsToTrack",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      // Activation logic if needed
    },
    async deactivate() {
      // Deactivation logic if needed
    },
    async deploy() {
      const now = Date.now();
      const perPage = 50;
      const documents = await this.zep.getDocuments({
        workspaceId: this.workspace,
        folderId: this.folder,
        page: 1,
        perpage: perPage,
        sort: "updated_at desc",
      });

      for (const document of documents) {
        this.$emit(document, {
          id: document.id || document.updated_at,
          summary: `Document Updated: ${document.title}`,
          ts: new Date(document.updated_at).getTime(),
        });
      }

      if (documents.length > 0) {
        const latestTs = documents.reduce((max, doc) => {
          const ts = new Date(doc.updated_at).getTime();
          return Math.max(max, ts);
        }, now);
        await this.db.set("lastTimestamp", latestTs);
      }
    },
  },
  async run() {
    const lastTimestamp = (await this.db.get("lastTimestamp")) || 0;
    const response = await this.zep.getDocuments({
      workspaceId: this.workspace,
      folderId: this.folder,
      updated_since: lastTimestamp,
      page: 1,
      perpage: 100,
      sort: "updated_at asc",
    });

    const updatedDocuments = response.filter((doc) => {
      const updatedAt = new Date(doc.updated_at).getTime();
      return updatedAt > lastTimestamp;
    });

    for (const doc of updatedDocuments) {
      let hasChanges = false;
      const changes = {};

      if (this.fieldsToTrack && this.fieldsToTrack.includes("title") && doc.title) {
        changes.title = doc.title;
        hasChanges = true;
      }
      if (this.fieldsToTrack && this.fieldsToTrack.includes("content") && doc.content) {
        changes.content = doc.content;
        hasChanges = true;
      }
      if (this.fieldsToTrack && this.fieldsToTrack.includes("metadata") && doc.metadata) {
        changes.metadata = doc.metadata;
        hasChanges = true;
      }

      if (hasChanges) {
        this.$emit(changes, {
          id: doc.id || doc.updated_at,
          summary: `Document Updated: ${doc.title}`,
          ts: new Date(doc.updated_at).getTime(),
        });
      }
    }

    if (updatedDocuments.length > 0) {
      const latestTimestamp = updatedDocuments.reduce((max, doc) => {
        const updatedAt = new Date(doc.updated_at).getTime();
        return Math.max(max, updatedAt);
      }, lastTimestamp);
      await this.db.set("lastTimestamp", latestTimestamp);
    }
  },
};
