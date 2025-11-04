import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-delete-reply",
  name: "Delete Reply",
  description: "Delete a reply on a specific comment. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/replies/delete) for more information",
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
  },
  async run({ $ }) {
    const response = await this.googleDrive.deleteReply({
      replyId: this.replyId,
      fileId: this.fileId,
      commentId: this.commentId,
    });
    $.export("$summary", `Successfully deleted reply with ID ${this.replyId}`);
    return response;
  },
};
