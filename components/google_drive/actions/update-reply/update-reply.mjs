import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-update-reply",
  name: "Update Reply",
  description: "Update a reply on a specific comment. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/replies/update) for more information",
  version: "0.0.1",
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
      optional: true,
    },
    fileIdTip: {
      type: "alert",
      alertType: "info",
      content: "You can use actions such as **Find File** or **List Files** to obtain a file ID, and use its value here.",
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file to obtain info for. You can select a file or use a file ID from a previous step.",
    },
    commentId: {
      propDefinition: [
        googleDrive,
        "commentId",
        (c) => ({
          fileId: c.fileId,
        }),
      ],
      description: "The comment to get info for. You can select a comment or use a comment ID from a previous step.",
    },
    replyId: {
      propDefinition: [
        googleDrive,
        "replyId",
        (c) => ({
          fileId: c.fileId,
          commentId: c.commentId,
        }),
      ],
      description: "The reply to get info for. You can select a reply or use a reply ID from a previous step.",
    },
    action: {
      type: "string",
      label: "Action",
      description: "The action the reply performed to the parent comment.",
      options: [
        "resolve",
        "reopen",
      ],
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "The plain text content of the reply.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleDrive.updateReply({
      replyId: this.replyId,
      fileId: this.fileId,
      commentId: this.commentId,
      requestBody: {
        action: this.action,
        content: this.content,
      },
    });

    $.export("$summary", `Successfully updated reply with ID ${this.replyId}`);
    return response;
  },
};
