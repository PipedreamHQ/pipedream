const googleDrive = require("../../google_drive.app");
const { getListFilesOpts } = require("../../utils");

module.exports = {
  key: "google_drive-find-file",
  name: "Find File",
  description: "Search for a specific file by name",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    /* eslint-disable pipedream/default-value-required-for-optional-props */
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
    },
  },
  async run() {
    const opts = getListFilesOpts(this.drive || undefined, {
      q: `name contains '${this.nameSearchTerm}'`,
    });
    return (await this.googleDrive.listFilesInPage(null, opts)).files;
  },
};
