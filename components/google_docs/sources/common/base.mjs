import newFilesInstant from "@pipedream/google_drive/sources/new-files-instant/new-files-instant.mjs";
import googleDrive from "../../google_docs.app.mjs";
import { MY_DRIVE_VALUE } from "@pipedream/google_drive/common/constants.mjs";
import { Readable } from "stream";

export default {
  ...newFilesInstant,
  props: {
    googleDrive,
    db: "$.service.db",
    http: "$.interface.http",
    timer: newFilesInstant.props.timer,
    folders: {
      propDefinition: [
        googleDrive,
        "folderId",
      ],
      type: "string[]",
      description: "(Optional) The folders you want to watch. Leave blank to watch for any new document.",
      optional: true,
    },
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "If true, the document will be uploaded to your File Stash and a temporary download link to the file will be emitted. See [the docs](https://pipedream.com/docs/connect/components/files) to learn more about working with files in Pipedream.",
      default: false,
      optional: true,
    },
    dir: {
      type: "dir",
      accessMode: "write",
      optional: true,
    },
  },
  hooks: {
    ...newFilesInstant.hooks,
    async deploy() {
      // Emit sample records on the first run
      const docs = await this.getDocuments(5);
      await this.emitFiles(docs);
    },
  },
  methods: {
    ...newFilesInstant.methods,
    getDriveId() {
      return googleDrive.methods.getDriveId(MY_DRIVE_VALUE);
    },
    shouldProcess(file) {
      return (
        file.mimeType.includes("document") &&
        newFilesInstant.methods.shouldProcess.bind(this)(file)
      );
    },
    getDocumentsFromFolderOpts(folderId) {
      const mimeQuery = "mimeType = 'application/vnd.google-apps.document'";
      let opts = {
        q: `${mimeQuery} and parents in '${folderId}' and trashed = false`,
      };
      return opts;
    },
    async getDocumentsFromFiles(files, limit) {
      return files.reduce(async (acc, file) => {
        const docs = await acc;
        const fileInfo = await this.googleDrive.getFile(file.id);
        return docs.length >= limit
          ? docs
          : docs.concat(fileInfo);
      }, []);
    },
    async getDocuments(limit) {
      const foldersIds = this.folders;

      if (!foldersIds?.length) {
        const opts = this.getDocumentsFromFolderOpts("root");
        const { files } = await this.googleDrive.listFilesInPage(null, opts);
        return this.getDocumentsFromFiles(files, limit);
      }

      return foldersIds.reduce(async (docs, folderId) => {
        const opts = this.getDocumentsFromFolderOpts(folderId);
        const { files } = await this.googleDrive.listFilesInPage(null, opts);
        const nextDocuments = await this.getDocumentsFromFiles(files, limit);
        return (await docs).concat(nextDocuments);
      }, []);
    },
    async emitFiles(files) {
      for (const file of files) {
        if (!this.shouldProcess(file)) {
          continue;
        }
        const doc = await this.googleDrive.getDocument(file.id);
        this.$emit(doc, this.generateMeta(doc));
      }
    },
    async stashFile(doc) {
      console.log("stashing file", doc);
      const response = await this.googleDrive.downloadFile({
        documentId: doc.documentId,
        mimeType: "application/pdf",
      });

      console.log("response", response);

      const filepath = `${doc.documentId}/${doc.title || doc.documentId}.pdf`;
      const file = await this.dir.open(filepath).fromReadableStream(
        Readable.from(response),
        "application/pdf",
        response.length,
      );

      // Return file with temporary download link
      return await file.withoutPutUrl().withGetUrl();
    },
  },
};
