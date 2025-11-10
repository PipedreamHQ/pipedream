import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-resolve-comment",
  name: "Resolve Comment",
  description: "Mark a comment as resolved. [See the documentation](https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/update)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
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
      description: "The file containing the comment to resolve.",
    },
    commentId: {
      propDefinition: [
        googleDrive,
        "commentId",
        (c) => ({
          fileId: c.fileId,
        }),
      ],
      description: "The ID of the comment to resolve.",
    },
  },
  async run({ $ }) {
    const response = await this.googleDrive.createCommentReply(
      this.fileId,
      this.commentId,
      {
        action: "resolve",
      },
    );

    $.export("$summary", `Successfully resolved comment ${this.commentId}.`);
    return response.data;
  },
};
