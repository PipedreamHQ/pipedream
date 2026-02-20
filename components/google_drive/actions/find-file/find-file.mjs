import commonSearchQuery from "../../common/commonSearchQuery.mjs";
import { getListFilesOpts } from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-find-file",
  name: "Find File",
  description: "Search for a specific file by name. [See the documentation](https://developers.google.com/drive/api/v3/search-files) for more information",
  version: "0.1.16",
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
    ...commonSearchQuery.props,
  },
  methods: commonSearchQuery.methods,
  async run({ $ }) {
    const q = this.getQuery();
    const opts = getListFilesOpts(this.drive, {
      q,
    });
    const files = (await this.googleDrive.listFilesInPage(null, opts)).files;
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully found ${files.length} file${files.length === 1 ? "" : "s"} with the query "${q}"`);
    return files;
  },
};
