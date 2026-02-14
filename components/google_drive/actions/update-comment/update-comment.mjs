import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-update-comment",
  name: "Update Comment",
  description: "Update the content of a specific comment. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/update) for more information",
  version: "0.0.2",
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
    content: {
      type: "string",
      label: "Content",
      description: "The new content of the comment.",
    },
  },
  async run({ $ }) {
    const response = await this.googleDrive.updateComment(
      this.commentId,
      this.fileId,
      {
        content: this.content,
      },
    );

    $.export("$summary", "Successfully updated comment");
    return response;
  },
};
