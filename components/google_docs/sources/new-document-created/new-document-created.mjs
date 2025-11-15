import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_docs-new-document-created",
  name: "New Document Created (Instant)",
  description: "Emit new event when a new document is created in Google Docs. [See the documentation](https://developers.google.com/drive/api/reference/rest/v3/changes/watch)",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(doc) {
      return {
        id: doc.documentId,
        summary: `New Document: ${doc.documentId}`,
        ts: Date.now(),
      };
    },
    async processChanges() {
      const lastFileCreatedTime = this._getLastFileCreatedTime();
      const timeString = new Date(lastFileCreatedTime).toISOString();

      const args = this.getListFilesOpts({
        q: `mimeType != "application/vnd.google-apps.folder" and createdTime > "${timeString}" and trashed = false`,
        orderBy: "createdTime desc",
        fields: "*",
      });

      const { files } = await this.googleDrive.listFilesInPage(null, args);
      if (!files?.length) {
        return;
      }
      await this.emitFiles(files);
      this._setLastFileCreatedTime(Date.parse(files[0].createdTime));
    },
  },
};
