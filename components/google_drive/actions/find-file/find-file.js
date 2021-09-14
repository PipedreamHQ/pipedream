const googleDrive = require("../../google_drive.app");
const { getListFilesOpts } = require("../../utils");

module.exports = {
  key: "google_drive-find-file",
  name: "Find File",
  description: "Search for a specific file by name",
  version: "0.0.8",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive you want to find a file in.",
      optional: true,
      default: "",
    },
    nameSearchTerm: {
      propDefinition: [
        googleDrive,
        "fileNameSearchTerm",
      ],
    },
  },
  async run() {
    const opts = getListFilesOpts(this.drive || undefined, {
      q: `name contains '${this.nameSearchTerm}'`,
    });
    return (await this.googleDrive.listFilesInPage(null, opts)).files;
  },
};
