import {
  getListFilesOpts, MY_DRIVE_VALUE,
} from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-search-files",
  name: "Search Files",
  description:
    "Search for files and folders in Google Drive using the Drive query language."
    + " This is the primary tool for finding files, folders, spreadsheets, forms, and any other Drive item."
    + " Returns matching files with their IDs, names, and MIME types."
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
    + " [See the documentation](https://developers.google.com/workspace/drive/api/guides/search-files)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
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
  },
  async run({ $ }) {
    // Default to My Drive (matching the `driveId` prop's documented behavior) rather
    // than falling through to getListFilesOpts's own default of `corpora: "allDrives"`,
    // which Google's docs discourage and which can return incomplete/erroring results.
    const opts = getListFilesOpts(this.driveId || MY_DRIVE_VALUE, {
      q: this.query,
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
