import { ConfigurationError } from "@pipedream/platform";
import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-create-document-comment",
  name: "Create Document Comment",
  description: "Add a comment to a Linear document, or reply to an existing comment on it. Use **Search Documents** to find the document ID, and **List Document Comments** to find a comment ID to reply to. For comments on issues use **Create Comment** instead. A reply's parent must be a top-level comment on the same document (Linear allows only one level of replies). Returns `success` and the new comment's `id`, `body`, `createdAt`, `parent`, and author. Example: `documentId: \"10b5bc2940c7\"`, `body: \"Looks good, one question on the rollout plan.\"` → returns `{success: true, comment: {id: \"cmt_xyz\", body: \"Looks good, one question on the rollout plan.\", parent: null}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=commentCreate)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    documentId: {
      propDefinition: [
        linearApp,
        "documentId",
      ],
      description: "The document to comment on: its UUID or slugId (the short code at the end of the document URL, e.g. `10b5bc2940c7`). Use **Search Documents** to find document IDs.",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The content of the comment in markdown format. Example: `Looks good, one question on the rollout plan.`",
    },
    parentId: {
      type: "string",
      label: "Parent Comment ID",
      description: "The ID of an existing top-level comment on this document to reply to (a UUID, e.g. `2160d3b4-99a7-41ad-a24f-b2f28ef7d320`). Linear allows only one level of replies, so don't pass the ID of a reply: top-level comments have `parent: null`, and for a reply use its `parent` ID instead. Leave blank to post a new top-level comment. Use **List Document Comments** to find comment IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.body?.trim()) {
      throw new ConfigurationError("Comment body cannot be empty");
    }

    const document = await this.linearApp.getDocumentForHistory({
      $,
      id: this.documentId,
    });
    if (!document?.documentContentId) {
      throw new ConfigurationError(`Document ${this.documentId} has no content ID, so it cannot be commented on`);
    }

    const input = {
      documentContentId: document.documentContentId,
      body: this.body,
    };
    if (this.parentId) {
      input.parentId = this.parentId;
    }

    const response = await this.linearApp.createDocumentComment({
      $,
      input,
    });

    if (!response?.success) {
      throw new Error("Linear did not create the comment");
    }

    $.export("$summary", this.parentId
      ? `Successfully replied to comment ${this.parentId} with comment ID ${response.comment.id}`
      : `Successfully created comment with ID ${response.comment.id}`);

    return response;
  },
};
