import googleDrive from "../../google_drive.app.mjs";
import { getListFilesOpts } from "../../common/utils.mjs";

export default {
  key: "google_drive-find-forms",
  name: "Find Forms",
  description: "List Google Form documents or search for a Form by name. [See the docs](https://developers.google.com/drive/api/v3/search-files) for more information",
  version: "0.0.2",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      label: "Parent Folder",
      description: "The ID of the parent folder which contains the file. If not specified, it will list files from the drive's top-level folder.",
      optional: true,
    },
    nameSearchTerm: {
      propDefinition: [
        googleDrive,
        "fileNameSearchTerm",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    let q = "mimeType = 'application/vnd.google-apps.form'";
    if (this.nameSearchTerm) {
      q = `${q} and name contains '${this.nameSearchTerm}'`;
    }
    if (this.folderId) {
      q = `${q} and "${this.folderId}" in parents`;
    }
    const opts = getListFilesOpts(this.drive, {
      q: q.trim(),
    });
    const files = (await this.googleDrive.listFilesInPage(null, opts)).files;
    $.export("$summary", `Successfully found ${files.length} form(s)`);
    return files;
  },
};
