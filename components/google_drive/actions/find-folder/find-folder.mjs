import { getListFilesOpts } from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";

import { GOOGLE_DRIVE_FOLDER_MIME_TYPE } from "../../common/constants.mjs";

export default {
  key: "google_drive-find-folder",
  name: "Find Folder",
  description: "Search for a specific folder by name. [See the documentation](https://developers.google.com/drive/api/v3/search-files) for more information",
  version: "0.1.15",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const escapedSearchTerm = this.nameSearchTerm?.replace(/'/g, "\\'") || "";
    let q = `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}' and name contains '${escapedSearchTerm}'`.trim();
    if (!this.includeTrashed) {
      q += " and trashed=false";
    }
    const opts = getListFilesOpts(this.drive, {
      q,
    });

    try {
      const { files: folders } = await this.googleDrive.listFilesInPage(null, opts);
      // eslint-disable-next-line multiline-ternary
      $.export("$summary", `Successfully found ${folders.length} folder${folders.length === 1 ? "" : "s"} containing the term, "${this.nameSearchTerm}"`);
      return folders;

    } catch (error) {
      console.log("Failed to find folders with query", error.response?.data?.error || error);
      throw JSON.stringify(error.response?.data?.error, null, 2);
    }
  },
};
