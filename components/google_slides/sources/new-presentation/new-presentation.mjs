import newFilesInstant from "../../../google_drive/sources/new-files-instant/new-files-instant.mjs";

export default {
  ...newFilesInstant,
  key: "google_slides-new-presentation",
  type: "source",
  name: "New Presentation (Instant)",
  description: "Emit new event each time a new presentation is created in a drive.",
  version: "0.0.3",
  hooks: {
    ...newFilesInstant.hooks,
    async deploy() {
      // Emit sample records on the first run
      const slides = await this.getPresentations(5);
      for (const fileInfo of slides) {
        const createdTime = Date.parse(fileInfo.createdTime);
        this.$emit(fileInfo, {
          summary: `New File: ${fileInfo.name}`,
          id: fileInfo.id,
          ts: createdTime,
        });
      }
    },
  },
  props: {
    ...newFilesInstant.props,
    folders: {
      ...newFilesInstant.props.folders,
      description:
        "(Optional) The folders you want to watch. Leave blank to watch for any new presentation in the Drive.",
    },
  },
  methods: {
    ...newFilesInstant.methods,
    shouldProcess(file) {
      return (
        file.mimeType.includes("presentation") &&
        newFilesInstant.methods.shouldProcess.bind(this)(file)
      );
    },
    getPresentationsFromFolderOpts(folderId) {
      const mimeQuery = "mimeType = 'application/vnd.google-apps.presentation'";
      let opts = {
        q: `${mimeQuery} and parents in '${folderId}' and trashed = false`,
      };
      if (!this.isMyDrive()) {
        opts = {
          corpora: "drive",
          driveId: this.getDriveId(),
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
          ...opts,
        };
      }
      return opts;
    },
    async getPresentations(limit) {
      const slides = [];
      const foldersIds = this.folders;
      for (const folderId of foldersIds) {
        const opts = this.getPresentationsFromFolderOpts(folderId);
        const filesWrapper = await this.googleDrive.listFilesInPage(null, opts);
        for (const file of filesWrapper.files) {
          const fileInfo = await this.googleDrive.getFile(file.id);
          slides.push(fileInfo);
          if (slides.length >= limit) { return slides; }
        }
      }
      return slides;
    },
  },
};
