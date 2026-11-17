import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-create-comment",
  name: "Create Comment",
  description: "Add a comment to a Google Doc, anchored to a piece of text (the highlighted-text comment you get in the Docs UI). Locate the text with **Find Text**, or pass an explicit **Start Index** and **End Index**. Optionally assign the comment to a user with **Assignee Email** so it becomes an action item for them. Use **Find Document** to resolve a document's name to its ID, and **List Comments** to read existing comments and their reply threads. To propose an edit instead of leaving a note, use **Replace Text** with **Suggest Changes**. Returns `{documentId, commentsCreated, commentIds, ranges}`. Example: `find` = `Q3 revenue`, `content` = `Please confirm this figure` returns `{documentId: \"1AbC...\", commentsCreated: 1, commentIds: [\"doco.Z5q_xTWKbB3F\"], ranges: [{startIndex: 42, endIndex: 52, tabId: \"t.0\"}]}`. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/batchUpdate)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleDocs,
    documentId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
    },
    content: {
      type: "string",
      label: "Comment",
      description: "The plain text of the comment, e.g. `Please confirm this figure before we send.`",
    },
    find: {
      propDefinition: [
        googleDocs,
        "findText",
      ],
      description: "The text to anchor the comment to, matched exactly, e.g. `Q3 revenue`. The action locates it in the document and comments on each match selected by **Occurrence**. Leave blank only if you are supplying **Start Index** and **End Index** instead.",
    },
    occurrence: {
      propDefinition: [
        googleDocs,
        "occurrence",
      ],
      description: "Which matches of **Find Text** get a comment: `first` (default) or `all`. `all` creates one separate comment thread per match.",
    },
    matchCase: {
      propDefinition: [
        googleDocs,
        "matchCase",
      ],
    },
    startIndex: {
      propDefinition: [
        googleDocs,
        "startIndex",
      ],
      description: "Character index where the comment's anchor starts, inclusive. Use with **End Index** instead of **Find Text**. Indices come from **Get Document** and shift after every edit, so prefer **Find Text**.",
    },
    endIndex: {
      propDefinition: [
        googleDocs,
        "endIndex",
      ],
      description: "Character index where the comment's anchor ends, exclusive. Must be greater than **Start Index**.",
    },
    tabId: {
      propDefinition: [
        googleDocs,
        "styleTabId",
      ],
    },
    assigneeEmail: {
      type: "string",
      label: "Assignee Email",
      description: "Email address of the user to assign the comment to, e.g. `user@example.com`. The comment then shows up as an action item for them. Leave blank for an unassigned comment.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      googleDocs,
      documentId,
      content,
      find,
      occurrence,
      matchCase,
      startIndex,
      endIndex,
      tabId,
      assigneeEmail,
    } = this;

    if (!content?.trim()) {
      throw new ConfigurationError("Comment cannot be empty.");
    }

    const assignee = assigneeEmail?.trim();
    if (assignee && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assignee)) {
      throw new ConfigurationError(`Assignee Email "${assignee}" is not a valid email address. Use a full address such as \`user@example.com\`, or leave it blank for an unassigned comment.`);
    }

    const ranges = await googleDocs.resolveStyleRanges(documentId, {
      find,
      matchCase,
      occurrence,
      startIndex,
      endIndex,
      tabId,
    });

    const response = await googleDocs.batchUpdate(documentId, ranges.map((range) => ({
      insertComment: {
        content,
        range,
        ...(assignee && {
          assigneeEmailAddress: assignee,
        }),
      },
    })));

    // Google can apply only some of a batch's comment requests, so count the
    // threads it actually created instead of trusting the request count.
    const commentIds = (response?.data?.replies ?? [])
      .map((reply) => reply?.insertComment?.commentThread?.commentId)
      .filter(Boolean);
    const count = ranges.length;
    if (commentIds.length !== count) {
      throw new Error(`Google created ${commentIds.length} of ${count} requested comments on document ${documentId}${commentIds.length
        ? ` (created: ${commentIds.join(", ")})`
        : ""}. Call **List Comments** to see which ones exist before retrying.`);
    }

    $.export("$summary", `Added ${count} comment${count === 1
      ? ""
      : "s"} to document ${documentId}${assignee
      ? ` assigned to ${assignee}`
      : ""}`);

    return {
      documentId,
      commentsCreated: count,
      commentIds,
      ranges,
    };
  },
};
