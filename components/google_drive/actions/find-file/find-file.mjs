import googleDrive from "../../google_drive.app.mjs";
import { getListFilesOpts } from "../../utils.mjs";

export default {
  key: "google_drive-find-file",
  name: "Find File",
  description: "Search for a specific file by name. [See the docs](https://developers.google.com/drive/api/v3/search-files) for more information",
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
    },
  },
  async run({ $ }) {
    const opts = getListFilesOpts(this.drive, {
      q: `name contains '${this.nameSearchTerm}'`,
    });
    const files = (await this.googleDrive.listFilesInPage(null, opts)).files;
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully found ${files.length} file${files.length === 1 ? "" : "s"} containing the term, "${this.nameSearchTerm}"`);
    return files;
  },
};
