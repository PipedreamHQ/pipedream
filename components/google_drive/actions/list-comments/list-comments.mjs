import googleDrive from "../../google_drive.app.mjs";
import { parseRfc3339 } from "../../common/utils.mjs";
import {
  COMMENTS_MAX_PAGE_SIZE, DEFAULT_COMMENT_LIMIT, MAX_COMMENT_LIMIT,
} from "../../common/constants.mjs";

export default {
  key: "google_drive-list-comments",
  name: "List Comments",
  description: "List the comments on a file, including each comment's author, plain text and HTML content, the file text it is anchored to, whether it is resolved, and its full reply thread. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/list)",
  version: "0.1.0",
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
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file to list comments for. You can select a file or use a file ID from a previous step.",
    },
    includeDeleted: {
      type: "boolean",
      label: "Include Deleted",
      description: "Whether to include deleted comments. Deleted comments are returned without their original content. Defaults to `false`.",
      optional: true,
      default: false,
    },
    startModifiedTime: {
      type: "string",
      label: "Start Modified Time",
      description: "Only return comments modified at or after this time, as an RFC 3339 timestamp (e.g. `2026-01-31T00:00:00Z`). A comment's modified time also changes when any of its replies changes, so this returns recently-active threads. Leave blank to return all comments.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of comments to return (min 1, max ${MAX_COMMENT_LIMIT}). Defaults to ${DEFAULT_COMMENT_LIMIT}.`,
      optional: true,
      default: DEFAULT_COMMENT_LIMIT,
      min: 1,
      max: MAX_COMMENT_LIMIT,
    },
  },
  async run({ $ }) {
    const args = {
      includeDeleted: this.includeDeleted,
    };

    if (this.startModifiedTime) {
      args.startModifiedTime = parseRfc3339(this.startModifiedTime, "Start Modified Time");
    }

    const limit = this.limit || DEFAULT_COMMENT_LIMIT;
    const comments = [];
    let pageToken;

    do {
      const { data } = await this.googleDrive.listSyncComments(
        // `comments.list` takes no `driveId` - a comment is addressed by file ID
        // alone - so the app method's first argument is intentionally unset. The
        // `drive` prop only scopes the **File** dropdown.
        undefined,
        this.fileId,
        {
          ...args,
          pageSize: Math.min(COMMENTS_MAX_PAGE_SIZE, limit - comments.length),
          pageToken,
        },
      );
      comments.push(...(data.comments || []));
      pageToken = data.nextPageToken;
    } while (pageToken && comments.length < limit);

    $.export("$summary", `Successfully found ${comments.length} comment(s) for file ${this.fileId}`);
    return comments;
  },
};
