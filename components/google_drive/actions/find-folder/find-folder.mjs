import googleDrive from "../../google_drive.app.mjs";
import { getListFilesOpts } from "../../utils.mjs";

import { GOOGLE_DRIVE_FOLDER_MIME_TYPE } from "../../constants.mjs";

export default {
  key: "google_drive-find-folder",
  name: "Find Folder",
  description: "Search for a specific folder by name. [See the docs](https://developers.google.com/drive/api/v3/search-files) for more information",
  version: "0.0.3",
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
  },
  async run({ $ }) {
    const opts = getListFilesOpts(this.drive, {
      q: `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}' and name contains '${this.nameSearchTerm}'`,
    });
    const folders = (await this.googleDrive.listFilesInPage(null, opts)).files;
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully found ${folders.length} folder${folders.length === 1 ? "" : "s"} containing the term, "${this.nameSearchTerm}"`);
    return folders;
  },
};
