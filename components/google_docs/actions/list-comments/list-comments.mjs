// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import {
  COMMENTS_MAX_PAGE_SIZE, DEFAULT_COMMENT_LIMIT, MAX_COMMENT_LIMIT,
} from "../../common/constants.mjs";

export default {
  key: "google_docs-list-comments",
  name: "List Comments",
  description: "List the comments on a Google Doc, including each comment's author, plain text and HTML content, the document text it is anchored to, whether it is resolved, and its full reply thread. Comments on a Doc are served by the Drive API, so the document ID doubles as the file ID. Use **Find Document** first to resolve a document's name to its ID. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleDocs,
    documentId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
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
      const parsed = Date.parse(this.startModifiedTime);
      if (Number.isNaN(parsed)) {
        throw new ConfigurationError(`Invalid Start Modified Time "${this.startModifiedTime}". Use an RFC 3339 timestamp, e.g. "2026-01-31T00:00:00Z".`);
      }
      args.startModifiedTime = new Date(parsed).toISOString();
    }

    const limit = this.limit || DEFAULT_COMMENT_LIMIT;
    const comments = [];
    let pageToken;

    do {
      const { data } = await this.googleDocs.listSyncComments(
        // `comments.list` takes no `driveId` - a comment is addressed by file ID
        // alone - so the app method's first argument is intentionally unset.
        undefined,
        this.documentId,
        {
          ...args,
          pageSize: Math.min(COMMENTS_MAX_PAGE_SIZE, limit - comments.length),
          pageToken,
        },
      );
      comments.push(...(data.comments || []));
      pageToken = data.nextPageToken;
    } while (pageToken && comments.length < limit);

    $.export("$summary", `Found ${comments.length} comment${comments.length === 1
      ? ""
      : "s"} on document ${this.documentId}`);
    return comments;
  },
};
