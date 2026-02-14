import { getListFilesOpts } from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-list-files",
  name: "List Files",
  description: "List files from a specific folder. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/list) for more information",
  version: "0.1.20",
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
    fields: {
      type: "string",
      label: "Fields",
      description: "The fields you want included in the response [(see the documentation for available fields)](https://developers.google.com/drive/api/reference/rest/v3/files). If not specified, the response includes a default set of fields specific to this method. For development you can use the special value `*` to return all fields, but you'll achieve greater performance by only selecting the fields you need.\n\n**eg:** `files(id,mimeType,name,webContentLink,webViewLink)`",
      optional: true,
    },
    filterText: {
      label: "Filter Text",
      description: "Filter by file name that contains a specific text",
      type: "string",
      optional: true,
      reloadProps: true,
    },
    trashed: {
      label: "Trashed",
      type: "boolean",
      description: "If `true`, list **only** trashed files. If `false`, list **only** non-trashed files. Keep it empty to include both.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.filterText) {
      props.filterType = {
        type: "string",
        label: "Filter Type",
        description: "Whether to return files with names containing the Filter Text or files with names that match the Filter Text exactly. Defaults to \"CONTAINS\"",
        options: [
          "CONTAINS",
          "EXACT MATCH",
        ],
        default: "CONTAINS",
      };
    }
    return props;
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
        : ""}name ${this.filterType === "CONTAINS"
        ? "contains"
        : "="} '${this.filterText}'`;
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
