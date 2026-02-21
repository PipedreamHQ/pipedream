import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-list-access-proposals",
  name: "List Access Proposals",
  description: "List access proposals for a file or folder. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/accessproposals/list)",
  version: "0.0.9",
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
    },
    fileOrFolderId: {
      propDefinition: [
        googleDrive,
        "fileOrFolderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const results = [];
    let pageToken;

    do {
      const {
        accessProposals, nextPageToken,
      } = await this.googleDrive.listAccessProposals({
        fileId: this.fileOrFolderId,
        pageToken,
      });
      if (!accessProposals) {
        break;
      }
      results.push(...accessProposals);
      if (this.maxResults && results.length >= this.maxResults) {
        results.length = this.maxResults;
        break;
      }
      pageToken = nextPageToken;
    } while (pageToken);

    $.export("$summary", `Successfully retrieved ${results.length} access proposal${results.length === 1
      ? ""
      : "s"}.`);
    return results;
  },
};
