const googleDrive = require("../../google_drive.app");
const { getListFilesOpts } = require("../../utils");

const { GOOGLE_DRIVE_FOLDER_MIME_TYPE } = require("../../constants");

module.exports = {
  key: "google_drive-find-folder",
  name: "Find Folder",
  description: "Search for a specific folder by name",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description:
        "The drive to use. If not specified, your personal Google Drive will be used. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
      optional: true,
    },
    nameSearchTerm: {
      propDefinition: [
        googleDrive,
        "fileNameSearchTerm",
      ],
      description: "The name of the folder to search for",
    },
  },
  async run() {
    const opts = getListFilesOpts(this.drive || undefined, {
      q: `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}' and name contains '${this.nameSearchTerm}'`,
    });
    return (await this.googleDrive.listFilesInPage(null, opts)).files;
  },
};
