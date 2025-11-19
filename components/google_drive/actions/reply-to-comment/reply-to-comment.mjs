import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-reply-to-comment",
  name: "Reply to Comment",
  description: "Add a reply to an existing comment. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/replies/create)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      optional: false,
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file containing the comment to reply to.",
    },
    commentId: {
      propDefinition: [
        googleDrive,
        "commentId",
        (c) => ({
          fileId: c.fileId,
        }),
      ],
      description: "The ID of the comment to reply to.",
    },
    content: {
      type: "string",
      label: "Reply Content",
      description: "The text content of the reply to add",
    },
  },
  async run({ $ }) {
    const response = await this.googleDrive.createCommentReply(
      this.fileId,
      this.commentId,
      {
        content: this.content,
      },
    );

    $.export("$summary", `Successfully added reply to comment ${this.commentId}`);
    return response.data;
  },
};
