import googleDrive from "../../google_drive.app.mjs";
import { getListFilesOpts } from "../../common/utils.mjs";

import { GOOGLE_DRIVE_FOLDER_MIME_TYPE } from "../../common/constants.mjs";

export default {
  key: "google_drive-find-folder",
  name: "Find Folder",
  description: "Search for a specific folder by name. [See the docs](https://developers.google.com/drive/api/v3/search-files) for more information",
  version: "0.0.6",
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
    nameSearchTerm: {
      propDefinition: [
        googleDrive,
        "fileNameSearchTerm",
      ],
      description: "The name of the folder to search for",
    },
    includeTrashed: {
      type: "boolean",
      label: "Include Trashed",
      description: "If set to true, returns all matches including items currently in the trash. Defaults to `false`.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    let q = `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}' and name contains '${this.nameSearchTerm}'`.trim();
    if (!this.includeTrashed) {
      q += " and trashed=false";
    }
    const opts = getListFilesOpts(this.drive, {
      q,
    });
    const folders = (await this.googleDrive.listFilesInPage(null, opts)).files;
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully found ${folders.length} folder${folders.length === 1 ? "" : "s"} containing the term, "${this.nameSearchTerm}"`);
    return folders;
  },
};
