import common from "../common/base.mjs";
import {
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
  GOOGLE_DRIVE_NOTIFICATION_UPDATE,
} from "@pipedream/google_drive/common/constants.mjs";

export default {
  ...common,
  key: "google_docs-new-or-updated-document",
  name: "New or Updated Document (Instant)",
  description: "Emit new event when a document is created or updated in Google Docs. [See the documentation](https://developers.google.com/drive/api/reference/rest/v3/changes/watch)",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getUpdateTypes() {
      return [
        GOOGLE_DRIVE_NOTIFICATION_CHANGE,
        GOOGLE_DRIVE_NOTIFICATION_UPDATE,
      ];
    },
    generateMeta(doc) {
      return {
        id: doc.revisionId,
        summary: `Document Updated: ${doc.documentId}`,
        ts: Date.now(),
      };
    },
    async processChanges(changedFiles) {
      const filteredFiles = this.checkMinimumInterval(changedFiles);

      for (const file of filteredFiles) {
        file.parents = (await this.googleDrive.getFile(file.id, {
          fields: "parents",
        })).parents;

        console.log(file); // see what file was processed

        if (!this.shouldProcess(file)) {
          console.log(`Skipping file ${file.name}`);
          continue;
        }

        const doc = await this.googleDrive.getDocument(file.id);
        const meta = this.generateMeta(doc);
        this.$emit(doc, meta);
      }
    },
  },
};
