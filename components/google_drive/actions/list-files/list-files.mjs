import { ConfigurationError } from "@pipedream/platform";
import {
  getListFilesOpts, isMyDrive,
} from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";
import { PAGINATION_TOKEN_FIELD } from "../../common/constants.mjs";

export default {
  key: "google_drive-list-files",
  name: "List Files",
  description: "List files from a specific folder. Set `Max Results` to cap how many files are returned per run, then pass the returned `nextPageToken` back in as `Page Token` on the next run to page through a large folder in fixed-size batches. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/list) for more information",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleDrive,
    limitToMyDrive: {
      label: "Limit to My Drive",
      type: "boolean",
      description: "When enabled, results are limited to My Drive. Shared drives and team drives are excluded. Note: files directly shared with you by another user ('Shared with me') will still appear.",
      default: false,
      optional: true,
    },
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
      description: "The fields you want included in the response [(see the documentation for available fields)](https://developers.google.com/drive/api/reference/rest/v3/files). If not specified, the response includes a default set of fields specific to this method. For development you can use the special value `*` to return all fields, but you'll achieve greater performance by only selecting the fields you need.\n\n**Important:** when supplying a custom mask scoped to `files(...)`, the top-level `nextPageToken` field must also be present (e.g. `nextPageToken,files(id,name)`) or pagination silently stops after the first page. This action automatically prepends `nextPageToken` to your mask when it is absent so all pages are returned.\n\n**eg:** `files(id,mimeType,name,createdTime,modifiedTime)`",
      optional: true,
    },
    filterText: {
      label: "Filter Text",
      description: "Filter by file name that contains a specific text",
      type: "string",
      optional: true,
    },
    filterType: {
      type: "string",
      label: "Filter Type",
      description: "Whether to return files with names containing the Filter Text or files with names that match the Filter Text exactly. Defaults to \"CONTAINS\". Not relevant unless `Filter Text` is entered.",
      options: [
        "CONTAINS",
        "EXACT MATCH",
      ],
      default: "CONTAINS",
      optional: true,
    },
    trashed: {
      label: "Trashed",
      type: "boolean",
      description: "If `true`, list **only** trashed files. If `false`, list **only** non-trashed files. Keep it empty to include both.",
      optional: true,
    },
    maxResults: {
      label: "Max Results",
      type: "integer",
      description: "The maximum number of files to return per run. Leave empty to return every file in the folder. Combine with `Page Token` to page through a large folder in fixed-size batches across multiple runs.",
      optional: true,
      min: 1,
    },
    pageToken: {
      label: "Page Token",
      type: "string",
      description: "A cursor for resuming a previous run. Pass the `nextPageToken` returned by an earlier run to continue listing from where it stopped instead of starting over. Leave empty to start from the beginning of the folder.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.limitToMyDrive && this.drive && !isMyDrive(this.drive)) {
      throw new ConfigurationError("`Limit to My Drive` cannot be enabled when a Shared Drive is selected in the `Drive` prop. Either clear the `Drive` selection (defaults to My Drive) or disable `Limit to My Drive`.");
    }
    const opts = getListFilesOpts(this.drive, {
      q: "",
      limitToMyDrive: this.limitToMyDrive,
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
      // Auto-append nextPageToken at the top level when the user's custom mask
      // omits it; without it the do/while loop exits after the first page.
      let fieldsValue = this.fields;
      if (!fieldsValue.includes(PAGINATION_TOKEN_FIELD)) {
        fieldsValue = `${PAGINATION_TOKEN_FIELD},${fieldsValue}`;
      }
      opts.fields = fieldsValue;
    }

    const maxResults = this.maxResults === undefined
      ? undefined
      : Number(this.maxResults);
    if (maxResults !== undefined && (!Number.isInteger(maxResults) || maxResults < 1)) {
      throw new ConfigurationError("`Max Results` must be a positive integer.");
    }

    const startToken = this.pageToken;
    const allFiles = [];
    let pageToken = startToken;
    do {
      const pageOpts = {
        ...opts,
      };
      if (maxResults) {
        // Request exactly as many as we still need (Drive caps pageSize at 1000).
        // Aligning pageSize to the remaining count means the returned
        // nextPageToken points right after the last file we keep, so no files
        // are skipped when resuming — we never over-fetch and discard.
        pageOpts.pageSize = Math.min(maxResults - allFiles.length, 1000);
      }
      const {
        files = [], nextPageToken,
      } = await this.googleDrive.listFilesInPage(pageToken, pageOpts);
      allFiles.push(...files);
      pageToken = nextPageToken;
    } while (pageToken && (!maxResults || allFiles.length < maxResults));

    const isComplete = !pageToken;
    const resumed = Boolean(startToken);
    let summary = `${resumed
      ? "Resumed and returned"
      : "Successfully found"} ${allFiles.length} file(s).`;
    // Only surface batch state when the caller is actually paging.
    if (maxResults || startToken || !isComplete) {
      summary += isComplete
        ? " Reached the end of the folder."
        : " More results remain — pass `nextPageToken` as `Page Token` on the next run to continue.";
    }
    $.export("$summary", summary);

    return {
      files: allFiles,
      count: allFiles.length,
      nextPageToken: pageToken ?? null,
      isComplete,
    };
  },
};
