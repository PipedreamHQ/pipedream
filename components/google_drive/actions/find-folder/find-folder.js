const googleDrive = require("../../google_drive.app");
const { getListFilesOpts } = require("../../utils");

module.exports = {
  key: "google_drive-find-folder",
  name: "Find Folder",
  description: "Search for a specific folder by name",
  version: "0.0.24",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to find a folder in.",
      optional: true,
      default: "",
    },
    nameSearchTerm: {
      propDefinition: [
        googleDrive,
        "fileNameSearchTerm",
      ],
      description: "The name of the folder to search for.",
    },
  },
  async run() {
    const opts = getListFilesOpts(this.drive || undefined, {
      q: `mimeType = 'application/vnd.google-apps.folder' and name contains '${this.nameSearchTerm}'`,
    });
    return (await this.googleDrive.listFilesInPage(null, opts)).files;
  },
};
