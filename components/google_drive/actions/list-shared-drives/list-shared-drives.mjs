import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-list-shared-drives",
  name: "List Shared Drives",
  description:
    "List shared drives accessible to the authenticated user."
    + " Returns drive IDs, names, and metadata for each shared drive."
    + " Use this when the user asks about their shared drives or needs to scope a search to a specific drive."
    + " Pass a drive ID to **Search Files** `driveId` parameter to search within a specific shared drive."
    + " Optionally filter by name using the `query` parameter (e.g., `name contains 'Engineering'`)."
    + " [See the documentation](https://developers.google.com/drive/api/v3/reference/drives/list)",
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
        "Optional. Filter shared drives by name."
        + " Example: `name contains 'Marketing'`."
        + " Omit to list all shared drives.",
      optional: true,
    },
  },
  async run({ $ }) {
    const allDrives = [];
    let pageToken;
    do {
      const {
        drives = [], nextPageToken,
      } = await this.googleDrive.searchDrives({
        q: this.query,
        pageToken,
        pageSize: 100,
      });
      allDrives.push(...drives);
      pageToken = nextPageToken;
    } while (pageToken);

    $.export("$summary", `Found ${allDrives.length} shared drive${allDrives.length === 1
      ? ""
      : "s"}`);
    return allDrives;
  },
};
// pub1776810225
