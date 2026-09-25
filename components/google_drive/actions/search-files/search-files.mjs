import { ConfigurationError } from "@pipedream/platform";
import { getListFilesOpts } from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";
import {
  DEFAULT_SEARCH_FILES_LIMIT,
  FILES_MAX_PAGE_SIZE,
} from "../../common/constants.mjs";

export default {
  key: "google_drive-search-files",
  name: "Search Files",
  description:
    "Search for files and folders in Google Drive using the Drive query language."
    + " This is the primary tool for finding files, folders, spreadsheets, forms, and any other Drive item."
    + " Returns an object with `files` (each with its ID, name, and MIME type), `count`,"
    + " `nextPageToken`, `isComplete`, and `incompleteSearch`."
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
    + "\n\n**Pagination** — each call returns at most `maxResults` files (default "
    + `${DEFAULT_SEARCH_FILES_LIMIT}). If \`isComplete\` is \`false\`, more matches exist:`
    + " call again with `pageToken` set to the returned `nextPageToken` and the **same**"
    + " `query`, `driveId`, and `includeItemsFromAllDrives` to get the next batch."
    + " When `isComplete` is `true`, `nextPageToken` is `null` and there are no more pages."
    + " If `incompleteSearch` is `true`, Drive did not search every drive, so matches may be"
    + " missing and paging will not recover them — narrow the search with `driveId`."
    + " Prefer narrowing the `query` over paging through many batches."
    + " [See the documentation](https://developers.google.com/drive/api/v3/search-files)",
  version: "1.0.0",
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
        + " Omit to search across all drives (My Drive and shared drives). Example: `0AExampleDriveId`.",
      optional: true,
    },
    includeItemsFromAllDrives: {
      type: "boolean",
      label: "Include Items From All Drives",
      description:
        "If true, search My Drive and all shared drives; if false, search only the user's own files"
        + " (files owned by or shared with the user), excluding shared drive contents."
        + " Ignored when `driveId` is set. Defaults to true. Example: `false`.",
      optional: true,
      default: true,
    },
    maxResults: {
      propDefinition: [
        googleDrive,
        "maxResults",
      ],
      description:
        "The maximum number of files to return in this call."
        + ` Defaults to ${DEFAULT_SEARCH_FILES_LIMIT}.`
        + " If more matches exist, the response has `isComplete: false` and a `nextPageToken`"
        + " to pass as `pageToken` on the next call. Example: `25`.",
      default: DEFAULT_SEARCH_FILES_LIMIT,
    },
    pageToken: {
      propDefinition: [
        googleDrive,
        "pageToken",
      ],
      description:
        "Optional. The `nextPageToken` from a previous **Search Files** response, to continue"
        + " where it stopped. Use the same `query`, `driveId`, and `includeItemsFromAllDrives`"
        + " as that call. Omit to start from the first result. Example: `~!!~AI9FV7Q...`.",
    },
  },
  async run({ $ }) {
    const includeAll = this.includeItemsFromAllDrives ?? true;
    // A shared drive needs includeItemsFromAllDrives: true, which the helper sets.
    // Otherwise, build opts here so the toggle actually picks the corpus.
    const opts = this.driveId
      ? getListFilesOpts(this.driveId, {
        q: this.query,
      })
      : {
        q: this.query,
        corpora: includeAll
          ? "allDrives"
          : "user",
        includeItemsFromAllDrives: includeAll,
        supportsAllDrives: includeAll,
      };

    const maxResults = Number(this.maxResults ?? DEFAULT_SEARCH_FILES_LIMIT);
    if (!Number.isInteger(maxResults) || maxResults < 1) {
      throw new ConfigurationError("`Max Results` must be a positive integer.");
    }

    const startToken = this.pageToken || undefined;
    const allFiles = [];
    let pageToken = startToken;
    let incompleteSearch = false;
    do {
      // Request only as many as we still need, so the returned nextPageToken
      // points right after the last file we keep and resuming skips nothing.
      const {
        files = [], nextPageToken, incompleteSearch: pageIncomplete,
      } = await this.googleDrive.listFilesInPage(pageToken, {
        ...opts,
        pageSize: Math.min(maxResults - allFiles.length, FILES_MAX_PAGE_SIZE),
      });
      allFiles.push(...files);
      pageToken = nextPageToken;
      // Drive sets this when it skipped some drives (typically with the
      // allDrives corpus); paging can't recover those results.
      incompleteSearch ||= Boolean(pageIncomplete);
    } while (pageToken && allFiles.length < maxResults);

    const isComplete = !pageToken;
    $.export("$summary", `${startToken
      ? "Resumed and found"
      : "Found"} ${allFiles.length} file${allFiles.length === 1
      ? ""
      : "s"} matching query "${this.query}".${isComplete
      ? ""
      : " More results remain — pass `nextPageToken` as `pageToken` to continue."}${incompleteSearch
      ? " Drive did not search every drive, so some matches may be missing — narrow the search with `driveId`."
      : ""}`);

    return {
      files: allFiles,
      count: allFiles.length,
      nextPageToken: pageToken ?? null,
      isComplete,
      incompleteSearch,
    };
  },
};
