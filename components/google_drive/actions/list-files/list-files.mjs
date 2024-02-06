import googleDrive from "../../google_drive.app.mjs";
import { getListFilesOpts } from "../../common/utils.mjs";

export default {
  key: "google_drive-list-files",
  name: "List Files",
  description: "List files from a specific folder. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/list) for more information",
  version: "0.1.4",
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
    fields: {
      type: "string",
      label: "Fields",
      description: "The paths of the fields you want included in the response. If not specified, the response includes a default set of fields specific to this method. For development you can use the special value `*` to return all fields, but you'll achieve greater performance by only selecting the fields you need.\n\n**eg:** `files(id,mimeType,name,webContentLink,webViewLink)`",
      optional: true,
    },
    filterText: {
      label: "Filter Text",
      description: "Filter by file name that contains a specific text",
      type: "string",
      optional: true,
    },
    trashed: {
      label: "Trashed",
      type: "boolean",
      description: "List trashed files or non-trashed files. Keep it empty to include both.",
      optional: true,
    },
  },
  async run({ $ }) {
    const opts = getListFilesOpts(this.drive, {
      q: "",
    });
    if (this.folderId) {
      opts.q = `"${this.folderId}" in parents`;
    }
    if (this.filterText) {
      opts.q += `${opts.q
        ? " AND "
        : ""}name contains '${this.filterText}'`;
    }
    if (typeof this.trashed !== "undefined") {
      opts.q += `${opts.q
        ? " AND "
        : ""}trashed=${this.trashed}`;
    }
    if (this.fields) {
      opts.fields = this.fields;
    }
    const allFiles = [];
    let pageToken;
    do {
      const {
        files, nextPageToken,
      }  = await this.googleDrive.listFilesInPage(pageToken, opts);
      allFiles.push(...files);
      pageToken = nextPageToken;
    } while (pageToken);
    $.export("$summary", `Successfully found ${allFiles.length} file(s).`);
    return allFiles;
  },
};
