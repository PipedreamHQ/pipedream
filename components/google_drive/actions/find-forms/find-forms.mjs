import commonSearchQuery from "../../common/commonSearchQuery.mjs";
import { getListFilesOpts } from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-find-forms",
  name: "Find Forms",
  description: "List Google Form documents or search for a Form by name. [See the documentation](https://developers.google.com/drive/api/v3/search-files) for more information",
  version: "0.0.15",
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
    queryAlert: {
      type: "alert",
      alertType: "info",
      content: "If no query or search name is specified, all forms in the selected drive/folder will be returned.",
    },
    ...commonSearchQuery.props,
    searchQuery: {
      ...commonSearchQuery.props.searchQuery,
      description:
        "Search for a file with a query. [See the documentation](https://developers.google.com/drive/api/guides/ref-search-terms) for more information. If specified, `Search Name` and `Parent Folder` will be ignored.",
    },
  },
  methods: commonSearchQuery.methods,
  async run({ $ }) {
    const q = this.getQuery("form", this.folderId);
    const opts = getListFilesOpts(this.drive, {
      q,
    });
    const files = (await this.googleDrive.listFilesInPage(null, opts)).files;
    $.export("$summary", `Successfully found ${files.length} form(s) with the query "${q}"`);
    return files.map((file) => ({
      ...file,
      url: `https://docs.google.com/forms/d/${file.id}`,
    }))
    ;
  },
};
