const base = require("../new-file/new-file");

module.exports = {
  ...base,
  key: "microsoft_onedrive-new-file-in-folder",
  name: "New File in Folder (Instant)",
  description: "Emit an event when a new file is added to a specific folder in a OneDrive drive",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...base.props,
    folder: {
      type: "string",
      label: "Folder",
      description: "The OneDrive folder to watch for new files",
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return [];
        }

        const foldersStream = this.microsoft_onedrive.listFolders();
        const result = [];
        for await (const folder of foldersStream) {
          const {
            name: label,
            id: value,
          } = folder;
          result.push({
            label,
            value,
          });
        }
        return result;
      },
    },
  },
  methods: {
    ...base.methods,
    getDeltaLinkParams() {
      return {
        folderId: this.folder,
      };
    },
  },
};
