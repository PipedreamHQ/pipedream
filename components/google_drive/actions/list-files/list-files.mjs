import googleDrive from "../../google_drive.app.mjs";
import { getListFilesOpts } from "../../utils.mjs";

export default {
  key: "google_drive-list-files",
  name: "List Files",
  description: "List files from a specific folder. [See the docs](https://developers.google.com/drive/api/v3/reference/files/list) for more information",
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
      description: "Filter by filename that contains a specific text",
      type: "string",
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
    if (this.fields) {
      opts.fields = this.fields;
    }
    const files = (await this.googleDrive.listFilesInPage(null, opts)).files;
    $.export("$summary", `Successfully found ${files.length} file(s).`);
    return files;
  },
};
