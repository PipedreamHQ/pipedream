import { getListFilesOpts } from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-search-files",
  name: "Search Files",
  description:
    "Search for files and folders in Google Drive using the Drive query language."
    + " This is the primary tool for finding files, folders, spreadsheets, forms, and any other Drive item."
    + " Returns matching files with their IDs, names, MIME types, and parent folder IDs."
    + "\n\n**Query syntax** — pass a Drive search query string. Examples:"
    + "\n- Find by name: `name contains 'Budget'`"
    + "\n- Exact name match: `name = 'Q4 Report'`"
    + "\n- Folders only: `mimeType = 'application/vnd.google-apps.folder'`"
    + "\n- Google Docs: `mimeType = 'application/vnd.google-apps.document'`"
    + "\n- Spreadsheets: `mimeType = 'application/vnd.google-apps.spreadsheet'`"
    + "\n- Files in a folder: `'FOLDER_ID' in parents`"
    + "\n- Not trashed: `trashed = false`"
    + "\n- Modified after date: `modifiedTime > '2024-01-01T00:00:00'`"
    + "\n- Combine with AND: `name contains 'Report' and mimeType = 'application/vnd.google-apps.document'`"
    + "\n- Owner filter: `'user@example.com' in owners`"
    + "\n\nWhen the user says 'my files', use **Get User Details** first to get the owner email."
    + " To scope to a shared drive, pass the `driveId` from **List Shared Drives**."
    + " [See the documentation](https://developers.google.com/drive/api/v3/search-files)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    googleDrive,
    query: {
      type: "string",
      label: "Query",
      description:
        "A Drive search query string. See the tool description for syntax examples."
        + " Common queries: `name contains 'keyword'`, `mimeType = 'application/vnd.google-apps.folder'`,"
        + " `'FOLDER_ID' in parents`, `trashed = false`.",
    },
    driveId: {
      type: "string",
      label: "Drive ID",
      description:
        "Optional. Scope the search to a specific shared drive."
        + " Use **List Shared Drives** to find available drive IDs."
        + " Omit to search My Drive.",
      optional: true,
    },
    includeItemsFromAllDrives: {
      type: "boolean",
      label: "Include Items From All Drives",
      description:
        "If true, include results from all drives (My Drive and shared drives)."
        + " Defaults to false.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const opts = getListFilesOpts(this.driveId, {
      q: this.query,
      includeItemsFromAllDrives: this.includeItemsFromAllDrives,
    });

    const allFiles = [];
    let pageToken;
    do {
      const {
        files, nextPageToken,
      } = await this.googleDrive.listFilesInPage(pageToken, opts);
      allFiles.push(...files);
      pageToken = nextPageToken;
    } while (pageToken);

    $.export("$summary", `Found ${allFiles.length} file${allFiles.length === 1
      ? ""
      : "s"} matching query "${this.query}"`);
    return allFiles;
  },
};
// published 1776808395
// v1776808904
// pub1776810225
