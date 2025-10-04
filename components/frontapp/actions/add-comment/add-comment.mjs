import frontApp from "../../frontapp.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "frontapp-add-comment",
  name: "Add Comment",
  description: "Add a comment to a conversation. [See the documentation](https://dev.frontapp.com/reference/add-comment)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    frontApp,
    conversationId: {
      propDefinition: [
        frontApp,
        "conversationId",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "Content of the comment. Can include markdown formatting.",
    },
    authorId: {
      propDefinition: [
        frontApp,
        "teammateId",
      ],
      label: "Author ID",
      optional: true,
    },
    isPinned: {
      type: "boolean",
      label: "Is Pinned?",
      description: "Whether or not the comment is pinned in its conversation",
      optional: true,
    },
    attachments: {
      propDefinition: [
        frontApp,
        "attachments",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.frontApp.addComment({
      $,
      conversationId: this.conversationId,
      data: {
        body: this.body,
        author_id: this.authorId,
        is_pinned: this.isPinned,
        attachments: this.attachments,
      },
      headers: utils.hasArrayItems(this.attachments) && {
        "Content-Type": "multipart/form-data",
      },
    });
    $.export("$summary", `Successfully created comment with ID: ${response.id}`);
    return response;
  },
};
